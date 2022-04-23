const { getConnection } = require('../database');
const TimeAgo = require('javascript-time-ago');
const en =  require('javascript-time-ago/locale/en.json');
const { validateDataRegister, validateDuplicateDataRegister, validateDataLogin, LoginProcess } = require('../helpers/validationUsers');
const { encryptPassword, matchPassword } = require('../helpers/encrypting');

const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../helpers/jwtServices');

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const getUsers = async (_req, res, next) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT u.Id, u.email, u.username, u.password, u.created_at, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id;');
    result.map(obj => obj.created_at = timeAgo.format(obj.created_at));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query('SELECT u.id, u.email, u.username, u.password, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.id = ?', id);
    if(result.length === 0){
      throw new Error('Invalid Id User provided');
    }
    res.json(result[0]);
  } catch (error) {
    next(error);
  }
}

const getUserByName = async (req, res, next) => {
  try {
    const connection = await getConnection();  
    let result = {};
    if(req.query.email){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.email LIKE '%${req.query.email}%' `);
    }
    else if(req.query.username){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.username LIKE '%${req.query.username}%' `);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const postNewUser = async (req, res, next) => {
  try {
    const {username, email, password, type_user_Id} = req.body;
    const data = {username, email, password, type_user_Id}
    await validateDataRegister(data);
    data.password = await encryptPassword(data.password);
    await validateDuplicateDataRegister(data.username, data.email);
    const connection = await getConnection(); 
    await connection.query(`INSERT INTO users (username, email, password, type_user_Id) VALUES ('${data.username}', '${data.email}', '${data.password}', '${data.type_user_Id}')`);
    res.json({ message: "User Created Successfully" });
  } catch (error) {
    next(error);
  }
}


const postLogin = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    const data = {username, email, password};
    await validateDataLogin(data);
    const connection = await getConnection();
    let result = {};
    if(data.email){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.email LIKE '%${data.email}%' `);
      if(result.length > 0){
        if(!await matchPassword(data.password, result[0].password)){
          throw new Error( `Invalid Credentials, passwords don't match `);
        }
        else{
          if(result[0].connected === 1){
            result[0].connected = true;
          }
          else if(result[0].connected === 0){
            result[0].connected = false;
          }

          const accessToken = await generateAccessToken(result[0]);
          const refreshToken = await generateRefreshToken(result[0]);
          const token = {accessToken, refreshToken};
          res.json({token});
        }
      }
      else{
        throw new Error( `Invalid Credentials, don't have user with that email`);
      }
    }
    else if(data.username){
      res.json(await LoginProcess(data));
    }
  } catch (error) {
    next(error);
  }
}

const postSingOut = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(`UPDATE users SET connected = false where id = ${req.body.id}`);
    res.json(result[0]);
  } catch (error) {
    next(error);
  }
} 

module.exports = { getUsers, getUserById, getUserByName, postNewUser, postLogin, postSingOut };
