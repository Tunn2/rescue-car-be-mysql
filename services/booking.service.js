const { Op, DataTypes } = require("sequelize");
const Car = require("../models/car.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Package = require("../models/package.model");
const moment = require("moment-timezone");

const getBookingByIdService = async (bookingId) => {
  return await Booking.findByPk(bookingId, {
    include: [
      { model: User, as: "staff1", attributes: ["id", "fullName", "phone"] },
      { model: User, as: "staff2", attributes: ["id", "fullName", "phone"] },
      { model: User, as: "user", attributes: ["id", "fullName", "phone"] },
      { model: Service, as: "services", attributes: ["id", "name", "price"] },
    ],
  });
};

const getBookingsByUserIdService = async (userId) => {
  return await Booking.findAll({
    where: { userId },
    include: [
      { model: User, as: "staff1", attributes: ["id", "fullName"] },
      { model: User, as: "staff2", attributes: ["id", "fullName"] },
    ],
    order: [["bookingDate", "DESC"]],
    raw: true,
  });
};

const updateBookingStatusByIdService = async ({
  bookingId,
  status,
  services,
}) => {
  if (status === "CANCELLED") {
    if (!bookingId) throw new Error("Không tìm thấy ID");

    const foundBooking = await Booking.findByPk(bookingId);
    if (!foundBooking) {
      throw new Error("Không tìm thấy booking với ID này");
    }

    if (foundBooking.status !== "PENDING") {
      throw new Error("Booking này đã được sắp xếp và không thể hủy");
    }
    console.log("???");
    await foundBooking.update({
      status: "CANCELLED",
      completedDate: moment().tz("Asia/Bangkok").toDate(),
    });
  } else if (status === "IN-PROGRESS") {
    await Booking.update(
      { status, arrivalDate: moment().tz("Asia/Bangkok").toDate() },
      { where: { id: bookingId } }
    );
  } else if (status === "FINISHED") {
    await Booking.update(
      { status, completedDate: moment().tz("Asia/Bangkok").toDate() },
      { where: { id: bookingId } }
    );
  } else if (status === "PENDING_PAYMENT") {
    console.log(services); // services là một mảng chứa ID của các dịch vụ

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await booking.setServices(services);

    console.log("Updated services for booking:", bookingId);

    const foundBooking = await Booking.findOne({
      where: { id: bookingId },
      raw: true,
    });
    const foundCar = await Car.findOne({
      where: { licensePlate: foundBooking.licensePlate },
    });

    let totalPrice = 0;
    if (foundCar.dataValues.packageId) {
      // 🔹 Lấy danh sách service trong package hiện tại
      const packageWithServices = await Package.findOne({
        where: { id: foundCar.packageId },
        include: [
          {
            model: Service,
            as: "services",
            attributes: ["id"],
            through: { attributes: ["serviceId"] }, // Lấy ID từ bảng trung gian
          },
        ],
      });

      const serviceIds = packageWithServices.services.map(
        (s) => s.dataValues.id
      );

      const newServiceIds = services.filter(
        (service) => !serviceIds.includes(service.toString())
      );

      if (newServiceIds.length === 0) {
        totalPrice = 0;
      } else {
        const foundServices = await Service.findAll({
          where: { id: newServiceIds },
        });
        totalPrice = foundServices.reduce(
          (total, service) => total + (service.price || 0),
          0
        );
      }
    } else {
      const foundServices = await Service.findAll({ where: { id: services } });
      totalPrice = foundServices.reduce(
        (total, service) => total + (service.price || 0),
        0
      );
    }

    await Booking.update(
      {
        price: totalPrice,
        totalPrice,
        status: totalPrice > 0 ? "PENDING_PAYMENT" : "FINISHED",
        completedDate: moment().tz("Asia/Bangkok").toDate(),
      },
      { where: { id: bookingId } }
    );
  }
  return true;
};

const getBookingsByStaffsIdService = async (staffId) => {
  return await Booking.findAll({
    where: {
      [Op.or]: [{ staff1Id: staffId }, { staff2Id: staffId }],
    },
    include: [
      { model: User, as: "staff1", attributes: ["id", "fullName"] },
      { model: User, as: "staff2", attributes: ["id", "fullName"] },
    ],
    order: [["bookingDate", "DESC"]],
    raw: true,
  });
};

const createBookingService = async ({
  userId,
  carId,
  phone,
  description,
  evidence,
  location,
}) => {
  const booking = await Booking.findOne({
    where: {
      status: { [Op.notIn]: ["FINISHED", "CANCELLED"] },
      userId,
    },
  });

  if (booking)
    throw new Error("Bạn đã book 1 cứu hộ trước đó, hãy đợi nó hoàn thành");

  const foundCar = await Car.findOne({
    where: { id: carId },
    attributes: ["licensePlate"],
    raw: true,
  });
  const foundUser = await User.findOne({
    where: { id: userId },
    attributes: ["fullName"],
    raw: true,
  });

  return await Booking.create({
    userId,
    carId,
    phone,
    description,
    evidence,
    location,
    licensePlate: foundCar.licensePlate,
    name: foundUser.fullName,
  });
};

const assignStaffsService = async ({ bookingId, staff1, staff2 }) => {
  await Booking.update(
    { staff1Id: staff1, staff2Id: staff2, status: "COMING" },
    { where: { id: bookingId } }
  );
  return true;
};
const getBookingsService = async () => {
  return await Booking.findAll({
    include: [
      { model: User, as: "staff1", attributes: ["id", "fullName"] },
      { model: User, as: "staff2", attributes: ["id", "fullName"] },
    ],
    order: [["bookingDate", "DESC"]],
  });
};

module.exports = {
  createBookingService,
  getBookingsService,
  assignStaffsService,
  getBookingsByStaffsIdService,
  updateBookingStatusByIdService,
  getBookingsByUserIdService,
  getBookingByIdService,
};
