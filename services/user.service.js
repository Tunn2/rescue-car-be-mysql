const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

const findUserByIdService = async (id) => {
  const user = await User.findByPk(id);
  if (user) return user.dataValues;
  return null;
};

const getAvailableStaffsService = async () => {
  const busyStaffs = await Booking.findAll({
    where: {
      status: ["PENDING", "COMING", "IN-PROGRESS"],
    },
    attributes: ["staff1Id", "staff2Id"],
    raw: true,
  });

  const busyStaffIds = new Set(
    busyStaffs
      .flatMap((booking) => [booking.staff1Id, booking.staff2Id])
      .filter((id) => id)
  );

  return await User.findAll({
    where: {
      role: "STAFF",
      id: { [Op.notIn]: Array.from(busyStaffIds) },
    },
    raw: true,
  });
};
const getStaffsService = async () => {
  return await User.findAll({
    where: { role: ["STAFF", "RECEPTIONIST"] },
    order: [["createdAt", "DESC"]],
    raw: true,
  });
};

const getCustomersService = async () => {
  return await User.findAll({
    where: { role: "CUSTOMER" },
    order: [["createdAt", "DESC"]],
    raw: true,
  });
};

const updateUserByIdService = async ({ userId, fullName, phone }) => {
  if (!userId) throw new Error("Invalid userId");

  const foundUser = await User.findOne({ where: { id: userId }, raw: true });
  if (!foundUser) throw new Error("Không tìm thấy ID người dùng");

  await User.update({ fullName, phone }, { where: { id: userId } });

  return await User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    raw: true,
  });
};

const findUserByEmailService = async (email) => {
  return await User.findOne({ where: { email } });
};

module.exports = {
  findUserByIdService,
  findUserByEmailService,
  updateUserByIdService,
  getStaffsService,
  getCustomersService,
  getAvailableStaffsService,
};
