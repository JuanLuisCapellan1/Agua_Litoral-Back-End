const { getConnection } = require('../database');

async function validateRoleUser(role){
  if(role === undefined || role === null || role === ""){
    throw new Error('Please provide a role user');
  }
  if(!isNaN(role)){
    throw new Error('INVALID INPUT PROVIDED');
  }
  const connection = await getConnection();
  let result = await connection.query( `SELECT ROLE FROM TYPE_USER WHERE ROLE = ${role}`);
  if(result.length > 0){
    throw new Error('THIS ROLE IS ALREADY CREATED');
  }
}

module.exports = { validateRoleUser }