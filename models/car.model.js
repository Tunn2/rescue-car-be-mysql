const { DataTypes } = require("sequelize");

const User = require("./user.model");
const sequelize = require("../configs/database");
const Package = require("./package.model");

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User, // Liên kết với bảng Users
        key: "id",
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Biển số xe phải duy nhất
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Package, // Liên kết với bảng Packages
        key: "id",
      },
    },
    expiredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: "cars", // Tên bảng trong MySQL
  }
);

// Thiết lập quan hệ với bảng User
Car.belongsTo(User, { foreignKey: "userId", as: "user" });

// Thiết lập quan hệ với bảng Package
Car.belongsTo(Package, { foreignKey: "packageId", as: "package" });

module.exports = Car;
