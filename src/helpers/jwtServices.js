const config = require('../config');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../database');

async function generateAccessToken(user) {
  return jwt.sign({id: user.id}, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '4h',
  });
}

async function generateRefreshToken(user) {
  return jwt.sign({id: user.id}, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '2d',
  }); 
}

async function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}

async function getIdTokenUsers(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
  } else { 
    // Forbidden
    res.sendStatus(403);
  }
  jwt.verify(req.token, config.ACCESS_TOKEN_SECRET, function(err, decodedToken) {
    if(err) { throw new Error('Invalid Token Provided'); }
    else {
     req.user = decodedToken.id;
     next();
    }
  });
}

async function validateRoleAdmin(loginId){
  const connection = await getConnection();
  let result = await connection.query(`SELECT u.id, u.username, t.type FROM users AS u JOIN type_user AS t ON u.type_user_id = t.id WHERE u.id = ${loginId}`);
  if(result[0].type === 'ADMIN'){
    return result[0];
  }else{
    throw new Error(`You don't have access to this site`);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getIdTokenUsers,
  validateRoleAdmin
};
