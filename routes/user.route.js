const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  updateUserByIdController,
  getStaffsController,
  getCustomersController,
  getAvailableStaffsController,
} = require("../controllers/user.controller");

const userRoute = express.Router();

userRoute.use(authenticate);
userRoute.put("/", updateUserByIdController);

userRoute.use(checkAdminRole);
userRoute.get("/staffs", getStaffsController);
userRoute.get("/customers", getCustomersController);
userRoute.get("/available-staffs", getAvailableStaffsController);

module.exports = userRoute;
