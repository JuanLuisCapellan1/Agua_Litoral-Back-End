const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employeeController');
const jwtServices = require('../helpers/jwtServices');

//GET ROUTES EMPLOYEES
router.get('/type-employee', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.getAllTypeEmployee);
router.get('/employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.getEmployeeById);
router.get('/employees', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.getAllEmployee);

//POST ROUTES EMPLOYEES
router.post('/type-employee', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.postNewTypeEmployee);
router.post('/employee', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.postNewEmployee);

//UPDATE ROUTES EMPLOYEES
router.put('/type-employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.updateTypeEmployee);

//DELETE ROUTES EMPLOYEES
router.delete('/type-employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin],employeeController.deleteTypeEmployee);
router.delete('/employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin],employeeController.deleteEmployee);

module.exports = router;