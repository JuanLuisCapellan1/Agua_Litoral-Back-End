const { getConnection } = require('../database');

async function validateDataRegisterEmployee(data){
  let result = {};
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


