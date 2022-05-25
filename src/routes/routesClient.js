const express = require('express');
const router = express.Router();

const clientController = require('../controller/clientController');
const jwtServices = require('../helpers/jwtServices');

//GET ROUTES
router.get('/client', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], clientController.getAllClient);

//POST ROUTES
router.post('/client', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], clientController.postNewClient);


module.exports = router;