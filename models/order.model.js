const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const User = require("./user.model");
const Package = require("./package.model");
const Car = require("./car.model");
const Booking = require("./booking.model");

const Order = sequelize.define(
  "Order",
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
        model: User,
        key: "id",
      },
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: true, // Không required như trong Mongoose
      references: {
        model: Package,
        key: "id",
      },
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Car,
        key: "id",
      },
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Booking,
        key: "id",
      },
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "FINISHED"),
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    tableName: "orders",
  }
);

// Thiết lập quan hệ với các bảng khác
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.belongsTo(Package, { foreignKey: "packageId", as: "package" });
Order.belongsTo(Car, { foreignKey: "carId", as: "car" });
Order.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

module.exports = Order;
