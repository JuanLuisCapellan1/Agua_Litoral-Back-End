const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../helpers/jwtServices');

async function generateNewAccessToken(req, res) {
  let response = {};
  try{
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader.split(' ')[1];
    const verify = await verifyRefreshToken(refreshToken);

    if(!verify){
      throw new Error( 'The provided refresh token is not valid.');
    } else{
      delete verify.iat;
      delete verify.exp;
      delete verify.nbf;
      delete verify.jti;
      response = {
        accessToken: await generateAccessToken(verify),
        refreshToken: await generateRefreshToken(verify),
      };
      return res.json({ response });
    }
  }catch(err){
    return res.json({
      error: { ...err, message: err.message },
    })
    .status(err.status_code || 500);
  }
}

module.exports = {generateNewAccessToken};
