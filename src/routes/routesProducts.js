const express = require('express');
const router = express.Router();

const productController = require('../controller/productController');
const jwtServices = require('../helpers/jwtServices');

//GET ROUTES
router.get('/products', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], productController.getAllProducts);
router.get('/product', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], productController.getProductsByName);
router.get('/products/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAccountant], productController.getProductByID);

//POST ROUTES
router.post('/products', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAuxManager], productController.postNewProducts);

//UPDATE ROUTES
router.put('/product/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAuxManager], productController.updateProduct);

//DELETE ROUTES
router.delete('/product/:id', [jwtServices.getIdTokenUsers, jwtServices.validateRoleAdmin], productController.deleteProducts);

module.exports = router;
