const { getConnection } = require('../database');
const TimeAgo = require('javascript-time-ago');
const en =  require('javascript-time-ago/locale/en.json');
const { validateDataRegister, validateDuplicateDataRegister, validateDataLogin, LoginProcess, LoginEmailProcess, paginationProcess } = require('../services/validationUsers');
const { encryptPassword, matchPassword } = require('../helpers/encrypting');
const { validateRoleUser } = require('../services/validateTypeUser');

const {generateAccessToken, generateRefreshToken} = require('../helpers/jwtServices');

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query(`SELECT u.Id, u.email, u.username, u.password, u.created_at, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id LIMIT ${limit} offset ${offset};`);
    result.map(obj => obj.created_at = timeAgo.format(obj.created_at));
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query('SELECT u.id, u.email, u.username, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.id = ?', id);
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
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();  
    let result = {};
    if(req.query.email){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.email LIKE '%${req.query.email}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO USERS FOUND BY ${req.query.email}`);
      }
    }
    else if(req.query.username){
      result = await connection.query(`SELECT u.id, u.username, u.email, u.password, u.connected, t.role FROM users as u join type_user as t on u.type_user_Id = t.Id WHERE u.username LIKE '%${req.query.username}%' LIMIT ${limit} OFFSET ${offset}`);
      if(result.length < 1){
        throw new Error(`NO USERS FOUND BY ${req.query.username}`);
      }
    }
    else{
      throw new Error(`PLEASE PROVIDE AN EMAIL OR USERNAME`);
    }
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error);
  }
}

const getAllTypeUser = async(req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const offset = (page - 1) * limit;
    const connection = await getConnection();
    const result = await connection.query(`SELECT * FROM type_user LIMIT ${limit} OFFSET ${offset}`); 
    const jsonResult = await paginationProcess(result, page, limit);
    const myJsonString = JSON.parse(JSON.stringify(jsonResult));
    res.json(myJsonString);
  } catch (error) {
    next(error)
  }
}

const postNewUser = async (req, res, next) => {
  try {
    const {username, email, password, type_user_Id} = req.body;
    const connected = 0;
    const data = {username, email, password, type_user_Id, connected}
    await validateDataRegister(data);
    data.password = await encryptPassword(data.password);
    await validateDuplicateDataRegister(data.username, data.email);
    const connection = await getConnection(); 
    await connection.query(`INSERT INTO users (username, email, password, type_user_Id, connected) VALUES ('${data.username}', '${data.email}', '${data.password}', '${data.type_user_Id}', '${data.connected}')`);
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

const postNewRoleUser = async (req, res, next) => {
  try {
    const newRoleUser = req.body.roleUser;
    const connection = await getConnection();
    await validateRoleUser(newRoleUser);
    await connection.query(`INSERT INTO type_user(role) values ('${newRoleUser}')`);
    res.json({message: 'Role Created Successfully'})
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    if(!req.params.id){
      throw new Error( 'Please provide an ID');
    }
    const connection = await getConnection();
    const { id } = req.params;
    let userData = { ...req.body };
    userData.id = id;
    if(req.body.email){
      const result = await connection.query('SELECT email FROM users WHERE email = ?', userData.email);
      if(result.length !== 0){
          throw new Error('There are already user with that email');
      }
    }
    else if(req.body.username){
      const result = await connection.query('SELECT username FROM users WHERE username = ?', userData.username);
      if(result.length !== 0){
          throw new Error('There are already user with that username');
      }
    }
    await connection.query(`UPDATE USERS SET ? WHERE ID = ?`, [userData, userData.id]);
    res.json({message: 'User Updated Successfully'})
  } catch (error) {
    next(error);
  }
}

const updateTypeUser = async (req, res, next) => {
  try {
    if(!req.body.id){
      throw new Error( 'Please provide an ID');
    }
    const connection = await getConnection();
    const typeData = { ...req.body };
    await connection.query(`UPDATE type_user SET ? WHERE ID = ?`, [typeData, typeData.id]);
    res.json({message: 'Type User Updated Successfully'});
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query(`DELETE FROM USERS WHERE ID = ${id}`);
    res.json({message: 'User Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}

const deleteTypeUser = async (req, res, next) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query(`DELETE FROM type_user WHERE ID = ${id}`);
    res.json({message: 'Type User Deleted Successfully'});
  } catch (error) {
    next(error);
  }
}



module.exports = { getUsers, getUserById, getUserByName, postNewUser, postLogin, postSingOut, postNewRoleUser, getAllTypeUser, deleteUser, deleteTypeUser, updateUser, updateTypeUser };
