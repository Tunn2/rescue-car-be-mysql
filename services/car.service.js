const Car = require("../models/car.model");
const Package = require("../models/package.model");

const deleteCarByIdService = async ({ userId, carId }) => {
  const foundCar = await Car.findOne({ where: { id: carId, userId } });

  if (!foundCar) throw new Error("Yêu cầu không hợp lệ");

  await Car.destroy({ where: { id: carId } });

  return true;
};

const createCarService = async ({
  brand,
  model,
  color,
  numberOfSeats,
  licensePlate,
  userId,
}) => {
  await checkCarExist({ licensePlate });

  const car = await Car.create({
    brand,
    color,
    licensePlate,
    numberOfSeats,
    model,
    userId,
  });

  return car;
};

const getCarByUserIdService = async (userId) => {
  const cars = await Car.findAll({
    where: { userId },
    include: [{ model: Package, as: "package" }],
    // raw: true,
  });
  return cars;
};

const checkCarExist = async ({ licensePlate }) => {
  const car = await Car.findOne({
    where: { licensePlate },
    attributes: ["licensePlate"],
  });

  if (car) throw new Error("Xe này đã được đăng ký");
};

module.exports = {
  deleteCarByIdService,
  createCarService,
  getCarByUserIdService,
};
