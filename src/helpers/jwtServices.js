const config = require('../config');
const jwt = require('jsonwebtoken');

async function generateAccessToken(user) {
  return jwt.sign({user}, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '4h',
  });
}

async function generateRefreshToken(user) {
  return jwt.sign({user}, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '2d',
  }); 
}

async function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
