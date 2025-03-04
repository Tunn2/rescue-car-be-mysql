const { registerService, loginService } = require("../services/auth.service");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService({ email, password });
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const registerController = async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;
    await registerService({ fullName, phone, email, password });
    return res.send({
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  // refreshTokenController,
  // registerForAdminController,
};
