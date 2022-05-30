const { getConnection } = require('../database');
const validatorEmployee = require('../services/validationEmployees');

const getAllTypeEmployee = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM type_employees ORDER BY ID ASC LIMIT ${limit} OFFSET ${offset}`);
    const jsonResult = await validatorEmployee.paginationProcessTypeEmployee(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}
const getAllEmployee = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query('SELECT e.id, e.first_name, e.last_name, e.id_card, e.address, e.phone, e.phone, e.admission, e.status, e.salary, u.email, u.username, te.job_position FROM employees as e join users as u on e.id_user = u.id join type_employees as te on e.type_employee = te.id LIMIT ? OFFSET ?', [limit, offset]);
    const jsonResult = await validatorEmployee.paginationProcessTypeEmployee(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query('SELECT e.id, e.first_name, e.last_name, e.id_card, e.address, e.phone, e.admission, e.status, e.salary, u.email, u.username, te.job_position FROM employees as e join users as u on e.id_user = u.id join type_employees as te on e.type_employee = te.id WHERE e.id = ?', id);
    if(result.length === 0){
      throw new Error('Invalid Id Employee provided');
    }
    if(result[0].connected === 1){
      result[0].connected = true;
    }
    else if(result[0].connected === 0){
      result[0].connected = false;
    }
    res.json(result[0]);
  } catch (error) {
    next(error);
  }
}

const getEmployeeByName = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();  
    let result = {};
    if(req.query.name){
      result = await connection.query(`SELECT * FROM employees WHERE FIRST_NAME LIKE '%${req.query.name}%' or LAST_NAME LIKE '%${req.query.name}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO USERS FOUND BY ${req.query.name}`);
      }
    }
    else{
      throw new Error(`PLEASE PROVIDE AN EMAIL OR NAME`);
    }
    const jsonResult = await validatorEmployee.paginationProcessTypeEmployee(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  }catch (error) {
    next(error);
  }
}

const postNewTypeEmployee = async (req, res, next) =>{
  try {
    const data = {
      job_position : req.body.job_position
    }
    const connection = await getConnection();
    await validatorEmployee.validateDataTypeEmployee(data.job_position);
    await connection.query(`INSERT INTO type_employees (JOB_POSITION) VALUES ('${data.job_position}')`);
    res.json({ message: 'TYPE EMPLOYEE CREATED SUCCESSFULLY' });
  } catch (error) {
    next(error);
  }
}

const postNewEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, idCard, address, phone, salary, idUser, status, admission, type_employee } = req.body;
    const data = { firstName, lastName, idCard, address, phone, salary, idUser, status, admission, type_employee };
    await validatorEmployee.validateDataNewEmployee(data);
    await validatorEmployee.validateDuplicateData(data);
    const connection = await getConnection();
    await connection.query(`INSERT INTO employees (FIRST_NAME, LAST_NAME, ID_CARD, ADDRESS, PHONE, SALARY, ID_USER, STATUS, TYPE_EMPLOYEE)
    values ('${firstName}', '${lastName}', '${idCard}', '${address}', '${phone}', ${salary}, ${idUser}, '${status}', ${type_employee} )`);
    res.json({message: 'EMPLOYEE CREATED SUCCESSFULLY'});
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

const updateEmployee = async (req, res, next) => {
  try {
    if(!req.params.id){
      throw new Error('Please provide an ID');
    }
    const employee = { ...req.body };
    employee.id = req.params.id;
    const connection = await getConnection();
    await connection.query(`UPDATE EMPLOYEES SET ? WHERE ID = ?`, [employee, employee.id]);
    res.json({message: 'EMPLOYEE UPDATED SUCCESSFULLY'});
  } catch (error) {
    next(error);
  }
}


const deleteTypeEmployee = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const result = await connection.query(`SELECT ID FROM type_employees WHERE ID = ${id}`);
    if(result.length <= 0){
      throw new Error('ID Provided not exists');
    }
    await connection.query(`DELETE FROM type_employees WHERE ID = ${id}`);
    res.json({message: 'Type Employee Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

const deleteEmployee = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const {id} = req.params;
    const result = await connection.query(`SELECT ID FROM employees WHERE ID = ${id}`);
    if(result.length <= 0){
      throw new Error('ID Provided not exists');
    }
    await connection.query(`DELETE FROM EMPLOYEES WHERE ID = ${id}`);
    res.json({message: 'Employee Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

module.exports = { postNewTypeEmployee, getEmployeeByName, getAllTypeEmployee, updateTypeEmployee, deleteTypeEmployee, postNewEmployee, getEmployeeById, getAllEmployee, updateEmployee, deleteEmployee };
