const { DataTypes } = require("sequelize");
const User = require("./user.model");
const sequelize = require("../configs/database");
const Car = require("./car.model");
const Service = require("./service.model");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff1Id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    staff2Id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    evidence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Car,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "COMING",
        "IN-PROGRESS",
        "PENDING_PAYMENT",
        "FINISHED",
        "CANCELED"
      ),
      defaultValue: "PENDING",
    },
    arrivalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bookingDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Vì đã có bookingDate, không cần createdAt
    tableName: "bookings",
  }
);

// Thiết lập quan hệ với các bảng khác
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
Booking.belongsTo(User, { foreignKey: "staff1Id", as: "staff1" });
Booking.belongsTo(User, { foreignKey: "staff2Id", as: "staff2" });
Booking.belongsTo(Car, { foreignKey: "carId", as: "car" });

// Thiết lập Many-to-Many với Service
Booking.belongsToMany(Service, { through: "Booking_Services", as: "services" });

module.exports = Booking;
