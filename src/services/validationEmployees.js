const { getConnection } = require('../database');

async function validateDataTypeEmployee(job_position){
  if(job_position === undefined || job_position === null || job_position === ""){
    throw new Error( 'PLEASE PROVIDE A JOB POSITION' );
  }
  const connection = await getConnection();
  const result = await connection.query(`SELECT * FROM type_employees WHERE JOB_POSITION = '${job_position}'`);
  if(result.length > 0){
    throw new Error('THERE ALREADY SAVED THAT JOB POSITION');
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

module.exports = { validateDataTypeEmployee, paginationProcessTypeEmployee };
