const express = require('express');
const router = express.Router();

const clientController = require('../controller/clientController');
const jwtServices = require('../helpers/jwtServices');

//GET ROUTES
router.get('/clients', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], clientController.getAllClient);
router.get('/client/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], clientController.getClientByID);
router.get('/client', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], clientController.getClientByName);

//POST ROUTES
router.post('/client', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAuxManager], clientController.postNewClient);

//PUT ROUTES
router.put('/client/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], clientController.updateClient);

//DELETE ROUTES
router.delete('/client/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], clientController.deleteClient);

module.exports = router;