const { getConnection } = require('../database');

async function validateDataTypeEmployee(job_position){
  if(job_position === undefined || job_position === null || job_position === ""){
    throw new Error( 'PLEASE PROVIDE A JOB POSITION' );
  }
  if(!isNaN(job_position)){
    throw new Error('INVALID INPUT PROVIDED');
  }
  const connection = await getConnection();
  const result = await connection.query(`SELECT * FROM type_employees WHERE JOB_POSITION = '${job_position}'`);
  if(result.length > 0){
    throw new Error('THERE ALREADY SAVED THAT JOB POSITION');
  }
}

async function validateDuplicateData(data){
  const connection = await getConnection();
  let result = await connection.query(`SELECT * FROM employees WHERE ID_CARD = '${data.idCard}'`);
  if(result.length > 0){
    throw new Error('THIS ID CARD IS ALREADY EXISTS');
  }
  result = await connection.query(`SELECT * FROM employees WHERE ID_USER = ${data.idUser}`);
  if(result.length > 0){
    throw new Error('THIS USER ID IS ALREADY TAKEN');
  }
}

async function validateStatusEmployee(status){
  if(!['active', 'disable'].includes(status)){
    throw new Error( 'PROVIDE CORRECT EMPLOYEE STATUS' );
  }
}

async function validateDataNewEmployee(data){
  if(data.firstName === undefined || data.firstName === null || data.firstName === ""){
    throw new Error('PLEASE PROVIDE A FIRST NAME');
  }
  else if(data.lastName === undefined || data.lastName === null || data.lastName === ""){
    throw new Error('PLEASE PROVIDE A LAST NAME');
  }
  else if(data.idCard === undefined || data.idCard === null || data.idCard === ""){
    throw new Error('PLEASE PROVIDE A CORRECT ID');
  }
  else if(data.address === undefined || data.address === null || data.address === ""){
    throw new Error('PLEASE PROVIDE AN ADDRESS');
  }
  else if(data.phone === undefined || data.phone === null || data.phone === ""){
    throw new Error('PLEASE PROVIDE A PHONE NUMBER');
  }
  else if(data.status === undefined || data.status === null || data.status === ""){
    throw new Error('PLEASE PROVIDE A STATUS');
  }
  else if(data.type_employee === undefined || data.type_employee === null || isNaN(data.type_employee)){
    throw new Error('PLEASE PROVIDE A CORRECT TYPE EMPLOYEE')
  }
  await validateNumberData(data);
  await validateStatusEmployee(data.status);
}

async function validateNumberData(data){
  if(data.idCard.length > 13){
    throw new Error('YOUR ID MUST BE CONTAIN 13 CHARACTER');
  }
  if(data.salary === undefined || data.salary === null || isNaN(data.salary)){
    throw new Error('PLEASE PROVIDE A SALARY');
  }
  else if(data.idUser === undefined || data.idUser === null || isNaN(data.idUser)){
    throw new Error('PLEASE PROVIDE AN ID USER');
  }
}

async function paginationProcessTypeEmployee(result, page, limit){
  const connection = await getConnection();
  const rows = await connection.query(`SELECT COUNT(*) AS numRows FROM type_employees`);
  var numRows = rows[0].numRows;
  const totalPage = Math.ceil(numRows / limit);
  return {
    Total_Users: result.length,
    Current_page: page,
    Total_pages: totalPage,
    users: result
  };
}

module.exports = { validateDataTypeEmployee, paginationProcessTypeEmployee, validateDataNewEmployee, validateDuplicateData, validateStatusEmployee };
