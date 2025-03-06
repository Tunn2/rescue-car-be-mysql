const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const {
  createCarController,
  getCarByUserIdController,
  deleteCarByIdController,
  updateCarByIdController,
} = require("../controllers/car.controller");
const carRoute = express.Router();

carRoute.use(authenticate);
carRoute.post("/", createCarController);
carRoute.get("/my-cars", getCarByUserIdController);
carRoute.delete("/:carId", deleteCarByIdController);
carRoute.put("/:carId", updateCarByIdController);

module.exports = carRoute;
