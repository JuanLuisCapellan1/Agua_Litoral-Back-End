const { getConnection } = require('../database');
const validatorTypeEmployee = require('../services/validationEmployees');

const getAllTypeEmployee = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM type_employees ORDER BY ID ASC LIMIT ${limit} OFFSET ${offset}`);
    const jsonResult = await validatorTypeEmployee.paginationProcessTypeEmployee(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const postNewTypeEmployee = async (req, res, next) =>{
  try {
    const data = {
      job_position : req.body.job_position
    }
    const connection = await getConnection();
    await validatorTypeEmployee.validateDataTypeEmployee(data.job_position);
    await connection.query(`INSERT INTO type_employees (JOB_POSITION) VALUES ('${data.job_position}')`);
    res.json({ message: 'TYPE EMPLOYEE CREATED SUCCESSFULLY' });
  } catch (error) {
    next(error);
  }
}

const updateTypeEmployee = async (req, res, next) => {
  try {
    if(!req.params.id){
      throw new Error( 'Please provide an ID');
    }
    const typeEmployee = { ...req.body };
    typeEmployee.id = req.params.id;
    const connection = await getConnection();
    await connection.query(`UPDATE type_employees SET ? WHERE ID = ?`, [typeEmployee, typeEmployee.id]);
    res.json({message: 'Type User Updated Successfully'});
  } catch (error) {
    next(error);
  }
}

const deleteTypeEmployee = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query(`DELETE FROM type_employees WHERE ID = ${id}`);
    res.json({message: 'Employee Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

module.exports = { postNewTypeEmployee, getAllTypeEmployee, updateTypeEmployee, deleteTypeEmployee };
