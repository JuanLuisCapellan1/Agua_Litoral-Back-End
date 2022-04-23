const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const jwtServices = require('../helpers/jwtServices');
const clientController = require('../controller/clientsController');

//GET ROUTES USER
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getUserByName);

//POST ROUTES USER
router.post('/register', userController.postNewUser);
router.post('/login', userController.postLogin);
router.post('/singOut', [jwtServices.getIdTokenUsers], userController.postSingOut);


//==========================================================CLIENT ROUTES========================================================>>>>
//GET ROUTES Client
router.get('/clients', [jwtServices.getIdTokenUsers], clientController.getAllClient);
router.get('/client:id', [jwtServices.getIdTokenUsers], clientController.getClientById);

module.exports = router;
