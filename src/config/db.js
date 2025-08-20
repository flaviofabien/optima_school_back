require('dotenv').config(); 
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.ADMIN_MYSQL_BD,
  process.env.ADMIN_MYSQL_ROOT,
  process.env.ADMIN_MYSQL_PASSWORD,
  {
    host: process.env.ADMIN_MYSQL_HOST,
    dialect: "mariadb",
    logging: false,
    timezone: "+02:00",
  }
);

module.exports = sequelize;