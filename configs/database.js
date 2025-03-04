require("dotenv").config();
const { Sequelize } = require("sequelize");

// Khởi tạo Sequelize với thông tin kết nối MySQL

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 13103,
    logging: false,
  }
);

module.exports = sequelize;
