const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employeeController');
const jwtServices = require('../helpers/jwtServices');

//GET ROUTES EMPLOYEES
router.get('/type-employee', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.getAllTypeEmployee);

//POST ROUTES EMPLOYEES
router.post('/type-employee', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.postNewTypeEmployee);


//UPDATE ROUTES EMPLOYEES
router.put('/type-employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], employeeController.updateTypeEmployee);

//DELETE ROUTES EMPLOYEES
router.delete('/type-employee/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin],employeeController.deleteTypeEmployee);

module.exports = router;