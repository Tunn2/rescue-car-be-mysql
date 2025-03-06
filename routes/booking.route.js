const express = require("express");

const {
  authenticate,
  checkAdminRole,
  checkStaffsRole,
} = require("../middlewares/auth.middleware");
const {
  createBookingController,
  getBookingsController,
  assignStaffsController,
  getBookingsByStaffsIdController,
  updateBookingStatusByIdController,
  getBookingsByUserIdController,
  getBookingByIdController,
} = require("../controllers/booking.controller");
const bookingRoute = express.Router();

bookingRoute.use(authenticate);
bookingRoute.post("/", createBookingController);
bookingRoute.get("/user", getBookingsByUserIdController);
bookingRoute.get("/:bookingId", getBookingByIdController);

bookingRoute.get(
  "/staff/:staffId",
  checkStaffsRole,
  getBookingsByStaffsIdController
);

bookingRoute.put(
  "/:bookingId/status",
  checkStaffsRole,
  updateBookingStatusByIdController
);
bookingRoute.use(checkAdminRole);

bookingRoute.get("/", getBookingsController);
bookingRoute.put("/:bookingId/assign", assignStaffsController);

module.exports = bookingRoute;
