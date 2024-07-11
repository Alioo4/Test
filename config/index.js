require("dotenv/config");

const config = {
    port: process.env.PORT || 8080,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn : process.env.JWT_EXPIRES_IN,
    jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN,
    dbUri: process.env.DB_URI,
    nodeEnv: process.env.NODE_ENV,
}

module.exports = config;