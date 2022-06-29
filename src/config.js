const config = {};
config.PORT = 3000;


/**
 * orm
 * @type {import("sequelize").Options}
 */
config.MODEL = {
  dialect: "mysql",
  database: "blog",
  username: "root",
  password: "flzx3qc_LTB",
  host: "localhost",
  timezone: "+08:00",
  logging: false
}


// hash加密密钥
config.SECRET_KEY = {
  PASSWORD:"$32FDSAFDSFG$#$&%^$^214#!$324234#@$@#$@#%$#@^%%#$7%^$7",
  TOKEN:"$3$#@!$#@!%^%$#@%@#43214312^%$#^%%#$6534765&^*%*&^%*(&^%1@$#@!$#@!$5678*^&%(**^&%^&*&^%*"
}


module.exports = config;