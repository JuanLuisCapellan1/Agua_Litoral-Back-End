const {getConnection} = require('../database');

async function validateEmailClientDuplicated(data){
  const connection = await getConnection();
  let result = await connection.query(`SELECT * FROM CLIENT WHERE EMAIL = '${data.email}'`);
  if(result.length > 0){
    throw new Error('THIS EMAIL IS ALREADY SAVED');
  }
}

async function validationNewClient(data){
  if(data.name === undefined || data.name === null || data.name === ""){
    throw new Error('PLEASE PROVIDE A NAME');
  }
  else if(data.address === undefined || data.address === null || data.address === ""){
    throw new Error('PLEASE PROVIDE AN ADDRESS');
  }
  else if(data.email === undefined || data.email === null || data.email === ""){
    throw new Error('PLEASE PROVIDE AN EMAIL ADDRESS');
  }
  else if(data.phone === undefined || data.phone === null || data.phone === ""){
    throw new Error('PLEASE PROVIDE A PHONE NUMBER');
  }
  else if(data.status === undefined || data.status === null || data.status === ""){
    throw new Error('PLEASE PROVIDE A CORRECT STATUS');
  }
}

module.exports = {
  validateEmailClientDuplicated,
  validationNewClient
}
