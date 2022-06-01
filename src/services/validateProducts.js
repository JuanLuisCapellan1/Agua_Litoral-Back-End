const { getConnection } = require('../database');

async function validateDuplicateProducts(data){
  const connection = await getConnection();  
  const result = connection.query(`SELECT NAME FROM PRODUCTS WHERE NAME = ${data.name}`);
  if(result.length == 0){
    throw new Error('THIS PRODUCT WAS ALREADY SAVED');
  }
}

async function validateSaveProducts(data){
  if(data.name === undefined || data.name === null || data.name === ''){
    throw new Error('PLEASE PROVIDE A NAME OF PRODUCT');
  }
  if(data.unit === undefined || data.unit === null || data.unit === ''){
    throw new Error('PLEASE PROVIDE AN UNIT OF MEASUREMENT');
  }
  if(data.amount === undefined || data.amount === null || data.amount === ''){
    throw new Error('PLEASE PROVIDE AN AMOUNT UNIT OF MEASUREMENT');
  }
  validateDuplicateProducts(data);
}

module.exports = {
  validateDuplicateProducts,
  validateSaveProducts
}
