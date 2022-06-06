const { getConnection } = require('../database');
const validProdc = require('../services/validateProducts');
const { paginationProcess } = require('../services/validationUsers');

const getAllProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM PRODUCTS LIMIT ${limit} OFFSET ${offset}`);
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getProductsByName = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    let result = {};
    if(req.query.name){
      result = await connection.query(`SELECT * FROM PRODUCTS WHERE NAME LIKE '%${req.query.name}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO PRODUCTS FOUND BY ${req.query.name}`);
      }
    }
    else{
      throw new Error(`PLEASE PROVIDE A NAME`);
    }
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getProductByID = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const {id} = req.params;
    let result = await connection.query(`SELECT * FROM PRODUCTS WHERE ID = ${id}`);
    if(result.length === 0){
      throw new Error('Invalid Id PRODUCT provided');
    }
    res.json(result[0]);
  } catch (error) {
    next();
  }
}

const postNewProducts = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if(!req.body.name || !req.body.unit || !req.body.amount){
      throw new Error( 'These fields must be completed (name, unit and amount)');
    }
    await validProdc.validateSaveProducts(data);
    const connection = await getConnection();
    await connection.query(`INSERT INTO PRODUCTS (name, UNIT, AMOUNT) VALUES ('${data.name}', '${data.unit}', '${data.amount}')`);
    res.json({ message: 'PRODUCT SAVED SUCCESSFULLY' });
  } catch (error) {
    next(error);
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const product = { ...req.body };
    product.id = req.params.id;
    const connection = await getConnection();
    await connection.query(`UPDATE PRODUCTS SET ? WHERE ID = ?`, [product, product.id]);
    res.json({message: 'PRODUCTS UPDATED SUCCESSFULLY'});
  } catch (error) {
    next(error);
  }
}

const deleteProducts = async (req, res, next) => {
  try {
    const {id} = req.params;
    const connection = await getConnection();
    const result = await connection.query(`SELECT ID FROM PRODUCTS WHERE ID = ${id}`);
    if(result.length <= 0){
      throw new Error('INVALID ID PROVIDED');
    }
    await connection.query(`DELETE FROM PRODUCTS WHERE ID = ${id}`);
    res.json({message: 'PRODUCTS Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductsByName,
  getProductByID,
  postNewProducts,
  updateProduct,
  deleteProducts
}
