const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const {
  createPaymentForPackageController,
  verifyIPNCall,
  createPaymentForBookingController,
} = require("../controllers/order.controller");

const paymentRoute = express.Router();

paymentRoute.get("/vnpay-ipn", verifyIPNCall);

paymentRoute.use(authenticate);
paymentRoute.post("/", createPaymentForPackageController);
paymentRoute.post("/booking", createPaymentForBookingController);

module.exports = paymentRoute;
