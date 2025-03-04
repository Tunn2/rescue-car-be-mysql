const Booking = require("../models/booking.model");
const Order = require("../models/order.model");
const Package = require("../models/package.model");
const moment = require("moment-timezone");
const getOrderByIdService = async (orderId) => {
  if (!orderId) throw new Error("ID không hợp lệ");

  const foundOrder = await Order.findOne({
    where: { id: orderId },
  });

  if (!foundOrder) throw new Error("Không tìm thấy đơn hàng");

  return foundOrder;
};

const createOrderForPackageService = async ({ packageId, carId, userId }) => {
  if (!packageId || !carId || !userId) throw new Error("ID không hợp lệ");

  const foundPackage = await Package.findOne({
    where: { id: packageId },
    attributes: ["price"],
    raw: true,
  });

  if (!foundPackage) throw new Error("Không tìm thấy gói dịch vụ");

  return await Order.create({
    carId,
    packageId,
    userId,
    price: foundPackage.price,
    totalPrice: foundPackage.price,
  });
};

const createOrderForBookingService = async ({ bookingId, userId }) => {
  if (!bookingId || !userId) throw new Error("ID không hợp lệ");

  const foundBooking = await Booking.findOne({
    where: { id: bookingId },
    raw: true,
  });

  if (!foundBooking) throw new Error("Không tìm thấy booking");

  return await Order.create({
    userId,
    price: foundBooking.price,
    totalPrice: foundBooking.totalPrice,
    bookingId,
  });
};

const updateOrderByIdService = async (orderId, status = "FINISHED") => {
  if (!orderId) throw new Error("ID không hợp lệ");

  const order = await Order.findOne({
    where: { id: orderId },
    raw: true,
  });

  if (!order) throw new Error("Không tìm thấy đơn hàng");

  const expiredDate = moment().tz("Asia/Bangkok").add(1, "year").toDate();

  if (order.bookingId) {
    await Booking.update({ status }, { where: { id: order.bookingId } });
  } else {
    await Car.update(
      { packageId: order.packageId, expiredDate },
      { where: { id: order.carId } }
    );
  }

  return await Order.update({ status }, { where: { id: orderId } });
};

module.exports = {
  createOrderForPackageService,
  getOrderByIdService,
  updateOrderByIdService,
  createOrderForBookingService,
};
