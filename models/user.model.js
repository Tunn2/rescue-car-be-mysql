const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database"); // Import kết nối database

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID, // Sử dụng UUID làm khóa chính
      defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động khi tạo mới
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        "CUSTOMER",
        "ADMIN",
        "STAFF",
        "RECEPTIONIST",
        "MANAGER"
      ), // Chỉ nhận các giá trị này
      defaultValue: "CUSTOMER",
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    tableName: "users", // Tên bảng trong MySQL
  }
);

module.exports = User;
