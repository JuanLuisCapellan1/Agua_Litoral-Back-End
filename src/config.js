require('dotenv').config();


module.exports = ({
    PORT: process.env.PORT || 4000,
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
});
