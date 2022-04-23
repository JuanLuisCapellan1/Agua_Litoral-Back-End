const { getConnection } = require('../database');
const TimeAgo = require('javascript-time-ago');
const en =  require('javascript-time-ago/locale/en.json');
const { validateDataRegister, validateDuplicateDataRegister, validateDataLogin, LoginProcess, LoginEmailProcess } = require('../helpers/validationUsers');
const { encryptPassword, matchPassword } = require('../helpers/encrypting');

const {generateAccessToken, generateRefreshToken} = require('../helpers/jwtServices');

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const getUsers = async (_req, res, next) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT u.Id, u.email, u.username, u.password, u.created_at, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id;');
    result.map(obj => obj.created_at = timeAgo.format(obj.created_at));
    result.map(obj => {
      if(obj.connected === 1){
        obj.connected = true;
      }
      else if(obj.connected === 0){
        obj.connected = false;
      }
    });
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
    if(result[0].connected === 1){
      result[0].connected = true;
    }
    else if(result[0].connected === 0){
      result[0].connected = false;
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
      if(result[0].connected === 1){
        result[0].connected = true;
      }
      else if(result[0].connected === 0){
        result[0].connected = false;
      }
    }
    else if(req.query.username){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.type FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.username LIKE '%${req.query.username}%' `);
      if(result[0].connected === 1){
        result[0].connected = true;
      }
      else if(result[0].connected === 0){
        result[0].connected = false;
      }
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
    if(data.email){
      const dataDB = await LoginEmailProcess(data);
      const accessToken = await generateAccessToken(dataDB);
      const refreshToken = await generateRefreshToken(dataDB);
      const token = {accessToken, refreshToken};
      res.json({token});
    }
    else if(data.username){
      const dataDB = await LoginProcess(data);
      const accessToken = await generateAccessToken(dataDB);
      const refreshToken = await generateRefreshToken(dataDB);
      const token = {accessToken, refreshToken};
      res.json({token});
    }
  } catch (error) {
    next(error);
  }
}

const postSingOut = async (req, res, next) => {
  try {
    const loginId = req.user;
    const connection = await getConnection();
    await connection.query(`UPDATE users SET connected = false where id = ${loginId}`);
    res.json({message: 'Deleted session'});
  } catch (error) {
    next(error);
  }
} 

module.exports = { getUsers, getUserById, getUserByName, postNewUser, postLogin, postSingOut };
