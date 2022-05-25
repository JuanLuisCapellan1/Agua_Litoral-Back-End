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


const postNewClient = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if(!req.body.name || !req.body.address || !req.body.phone || !req.body.status){
      throw new Error( 'These fields must be completed (name, address, phone and status)');
    }
    await validationClient.validateEmailClientDuplicated(data);
    await validationClient.validationNewClient(data);
    const connection = await getConnection();
    await connection.query(`INSERT INTO client (name, address, phone, status) VALUES ('${data.name}', '${data.address}', '${data.phone}', '${data.status}')`);
    res.json({ message: 'CLIENT SAVED SUCCESSFULLY' });
  } catch (error) {
    next(error);
  }
}



module.exports = {
  postNewClient,
  getAllClient
}