const { getConnection } = require('../database');
const validationClient = require('../services/validationClients');

const {paginationProcess} = require('../services/validationUsers');

const getAllClient = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    let result = await connection.query(`SELECT * FROM CLIENT LIMIT ${limit} OFFSET ${offset}`);
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getClientByName = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    let result = {};
    if(req.query.name){
      result = await connection.query(`SELECT * FROM CLIENT WHERE NAME LIKE '%${req.query.name}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO CLIENT FOUND BY ${req.query.name}`);
      }
    }else if (req.query.email){
      result = await connection.query(`SELECT * FROM CLIENT WHERE email LIKE '%${req.query.email}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO CLIENT FOUND BY ${req.query.email}`);
      }
    }
    else{
      throw new Error(`PLEASE PROVIDE AN EMAIL OR NAME`);
    }
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getClientByID = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const {id} = req.params;
    let result = await connection.query(`SELECT * FROM CLIENT WHERE ID = ${id}`);
    if(result.length === 0){
      throw new Error('Invalid Id Client provided');
    }
    res.json(result[0]);
  } catch (error) {
    next();
  }
}


const postNewClient = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if(!req.body.name || !req.body.address || !req.body.email || !req.body.phone || !req.body.status){
      throw new Error( 'These fields must be completed (name, address, email, status and phone)');
    }
    await validationClient.validateEmailClientDuplicated(data);
    await validationClient.validationNewClient(data);
    const connection = await getConnection();
    await connection.query(`INSERT INTO client (name, address, email, phone, status) VALUES ('${data.name}', '${data.address}', '${data.email}', '${data.phone}', '${data.status}')`);
    res.json({ message: 'CLIENT SAVED SUCCESSFULLY' });
  } catch (error) {
    next(error);
  }
}

const updateClient = async (req, res, next) => {
  try {
    const client = { ...req.body };
    const connection = await getConnection();
    if(req.params.id){
      let resp = await connection.query(`SELECT ID FROM CLIENT WHERE ID = ${req.params.id}`);
      if(resp.length === 0){
        throw new Error('INVALID CLIENT ID PROVIDED');
      }
    }
    if(client.status){
      await validationClient.validateStatusClient(client.status);
    }
    await connection.query(`UPDATE CLIENT SET ? WHERE ID = ?`, [client, req.params.id]);
    res.json({message: 'CLIENT UPDATED SUCCESSFULLY'});
  } catch (error) {
    next(error);
  }
}

const deleteClient = async (req, res, next) => {
  try {
    const {id} = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT ID FROM CLIENT WHERE ID = ${id}`);
    if(result.length <= 0){
      throw new Error('INVALID ID PROVIDED');
    }
    await connection.query(`DELETE FROM CLIENT WHERE ID = ${id}`);
    res.json({message: 'CLIENT Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postNewClient,
  getAllClient,
  getClientByID,
  getClientByName,
  updateClient,
  deleteClient
}