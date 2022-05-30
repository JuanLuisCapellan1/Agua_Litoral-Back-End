const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const jwtServices = require('../helpers/jwtServices');
const refreshControllerToken = require('../controller/refreshTokenController');

//GET ROUTES USER
router.get('/users', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.getUsers);
router.get('/user/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.getUserById);
router.get('/user', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.getUserByName);
router.get('/type-user', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.getAllTypeUser);

//POST ROUTES USER
router.post('/register', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAuxManager], userController.postNewUser);
router.post('/login', userController.postLogin);
router.post('/refresh-token', refreshControllerToken.generateNewAccessToken);
router.post('/singOut', [jwtServices.getIdTokenUsers], userController.postSingOut);

router.post('/type-user', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAuxManager], userController.postNewRoleUser);

//DELETE ROUTES USER
router.delete('/user/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], userController.deleteUser);
router.delete('/type-user/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], userController.deleteTypeUser);

//UPDATE ROUTES USER
router.put('/user/update/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.updateUser);
router.put('/type-user/update/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], userController.updateTypeUser);

module.exports = router;
