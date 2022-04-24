const { getConnection } = require('../database');
const { matchPassword } = require('../helpers/encrypting');

async function validateDataRegister(data){
  if(data.email === undefined || data.email === null || data.email === ""){
    throw new Error( 'Please provide an email' );
  }
  else if(data.username === undefined || data.username === null || data.username === ""){
    throw new Error( 'Please provide an username' );
  }
  else if(data.password === undefined || data.password === null || data.password === ""){
    throw new Error( 'Please provide an password' );
  }
  else if(data.type_user_Id === undefined || data.password === null || isNaN(data.type_user_Id) || data.type_user_Id === "" ){
    throw new Error( 'Please provide an correct type id' );
  }
}

async function validateDuplicateDataRegister(username, email){
  let result = {};
  const connection = await getConnection();
  result = await connection.query('SELECT email FROM users WHERE email = ?', email);
  if(result.length !== 0){
      throw new Error('There are already user with that email');
  }
  result = await connection.query('SELECT username FROM users WHERE username = ?', username);
  if(result.length !== 0){
      throw new Error('There are already user with that username');
  }
}

async function validateDataLogin(data){
  if(data.email === undefined || data.email === null || data.email === ""){
    if(data.username === undefined || data.username === null || data.username === ""){
      throw new Error( 'Please provide an username or an email' );
    }
  }
  else if(data.password === undefined || data.password === null || data.password === ""){
    throw new Error( 'Please provide an password' );
  }
}

async function LoginProcess(data){
  const connection = await getConnection();
  let result = {};
  result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.username LIKE '%${data.username}%' `);
  if(result.length > 0){
    if(!await matchPassword(data.password, result[0].password)){
      throw new Error( `Invalid Credentials, passwords don't match `);
    }
    else{
      await connection.query(`UPDATE users SET connected = 1 WHERE username LIKE '%${data.username}%'`);
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.username LIKE '%${data.username}%' `);
      if(result[0].connected === 1){
        result[0].connected = true;
      }
      else if(result[0].connected === 0){
        result[0].connected = false;
      }
      return result[0];
    }
  }
  else{
    throw new Error( `Invalid Credentials, don't have user with that username`);
  }
}

async function LoginEmailProcess(data){
  const connection = await getConnection();
  let result = {};
  result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.email LIKE '%${data.email}%' `);
  if(result.length > 0){
    if(!await matchPassword(data.password, result[0].password)){
      throw new Error( `Invalid Credentials, passwords don't match `);
    }
    else{
      await connection.query(`UPDATE users SET connected = 1 WHERE email LIKE '%${data.email}%'`);
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.email LIKE '%${data.email}%' `);
      if(result[0].connected === 1){
        result[0].connected = true;
      }
      else if(result[0].connected === 0){
        result[0].connected = false;
      }
      return result[0];
    }
  }
  else{
    throw new Error( `Invalid Credentials, don't have user with that username`);
  }
}

async function paginationProcess(result, page, limit){
  const connection = await getConnection();
  result.map(obj => {
    if(obj.connected === 1){
      obj.connected = true;
    }
    else if(obj.connected === 0){
      obj.connected = false;
    }
  });
  const rows = await connection.query(`SELECT COUNT(*) AS numRows FROM users`);
  var numRows = rows[0].numRows;
  const totalPage = Math.ceil(numRows / limit);
  return {
    Total_Users: result.length,
    Current_page: page,
    Total_pages: totalPage,
    users: result
  };
}

module.exports = { validateDataRegister, validateDuplicateDataRegister, validateDataLogin, LoginProcess, LoginEmailProcess, paginationProcess };
