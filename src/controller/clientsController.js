const { getConnection } = require('../database');
const validationUsers= require('../helpers/validationUsers');
const jwtServices = require('../helpers/jwtServices');

const getAllClient = async (req, res, next) => {
  try {
    const loginId = req.user;
    await jwtServices.validateRoleAdmin(loginId);
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM clients');
    res.json(result); 
  } catch (error) {
    next(error);
  }
}

const getClientById = async (req, res, next) => {
  try {
    const loginId = req.user;
    await jwtServices.validateRoleAdmin(loginId);
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(`SELECT * FROM clients WHERE id = ${id}`);
    console.log(result);
    if(result.length === 0){
      throw new Error('Invalid Id User provided');
    }
    res.json(result); 
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllClient, getClientById }
