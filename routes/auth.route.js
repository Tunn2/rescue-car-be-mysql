const express = require("express");
const {
  registerController,
  loginController,
  registerForAdminController,
} = require("../controllers/auth.controller");
const authRoute = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");

authRoute.post("/register", registerController);
authRoute.post("/login", loginController);
authRoute.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Cập nhật trạng thái xác thực
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.isActive = true;
    await user.save();

    res.render("index", { message: "Tài khoản đã được xác thực thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Xác thực thất bại hoặc token hết hạn" });
  }
});

authRoute.use(authenticate);
authRoute.use(checkAdminRole);
authRoute.post("/admin/register", registerForAdminController);

module.exports = authRoute;
