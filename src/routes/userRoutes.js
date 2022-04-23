const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

//User Routes
//GET ROUTES
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getUserByName);

//POST ROUTES
router.post('/register', userController.postNewUser);
router.post('/login', userController.postLogin);
router.post('/singOut', userController.postSingOut);

module.exports = router;
