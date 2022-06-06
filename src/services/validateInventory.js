const { getConnection } = require('../database');

async function validateNewInventory(data){
  if(data.id_product === undefined || data.id_product === null || data.id_product === ''){
    throw new Error('PLEASE PROVIDE AN ID PRODUCT');
  }
  if(data.purchase === undefined || data.purchase === null || data.purchase === ''){
    throw new Error('PLEASE PROVIDE A PURCHASE PRICE');
  }
  if(data.sale === undefined || data.sale === null || data.sale === ''){
    throw new Error('PLEASE PROVIDE A SALE PRICE');
  }
  if(data.stock === undefined || data.stock === null || data.stock === ''){
    throw new Error('PLEASE PROVIDE A STOCK AMOUNT');
  }
  if(data.min_stock === undefined || data.min_stock === null || data.min_stock === ''){
    throw new Error('PLEASE PROVIDE A MINIMUM STOCK AMOUNT');
  }
  await validateInvalidIdProduct(data.id_product);
}

async function validateInvalidIdProduct(id){
  const connection = await getConnection();
  const resp = await connection.query(`SELECT ID FROM PRODUCT WHERE ID = '${id}'`);
  if(resp.length === 0){
    throw new Error('INVALID PRODUCT ID PROVIDED'); 
  }
}

module.exports = {
  validateNewInventory,
}