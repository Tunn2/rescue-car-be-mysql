const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createAPackageController,
  getPackagesController,
  getPackageByIdController,
} = require("../controllers/package.controller");

const packageRoute = express.Router();
packageRoute.get("/", getPackagesController);
packageRoute.get("/:packageId", getPackageByIdController);
packageRoute.use(authenticate);
packageRoute.use(checkAdminRole);
packageRoute.post("/", createAPackageController);

module.exports = packageRoute;
