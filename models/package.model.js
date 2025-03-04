const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const Service = require("./service.model");

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "packages", // Đặt tên bảng rõ ràng
  }
);

// Thiết lập quan hệ Many-to-Many với Service
Package.belongsToMany(Service, { through: "Package_Services", as: "services" });

module.exports = Package;
