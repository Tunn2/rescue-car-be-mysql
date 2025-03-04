require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sendVerificationEmail = require("./mail.service");

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    if (user.dataValues.isActive === false) {
      throw new Error(
        "Tài khoản này chưa được kích hoạt. Kiểm tra email để kich hoạt"
      );
    }
    const validPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (validPassword) {
      delete user.dataValues["password"];
      const { id, role } = user.dataValues;
      const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      return {
        ...user.dataValues,
        accessToken: token,
        refreshToken: refreshToken,
      };
    } else {
      throw new Error("Sai email hoặc mật khẩu");
    }
  } else {
    throw new Error("Sai email hoặc mật khẩu");
  }
};

const registerService = async ({ fullName, password, email, phone, role }) => {
  const isExistedEmail = await checkEmailExist(email);
  if (isExistedEmail) throw new Error("Email này đã được sử dụng");
  const hashedPassword = await bcrypt.hash(password, 10);
  let user = null;
  if (role) {
    user = await User.create({
      fullName,
      password: hashedPassword,
      email,
      phone,
      role,
    });
  } else {
    user = await User.create({
      fullName,
      password: hashedPassword,
      email,
      phone,
    });
  }

  delete user.dataValues.password;
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  sendVerificationEmail(email, verificationToken);
  return true;
};

const registerForAdminService = async ({
  fullName,
  password,
  email,
  phone,
  role,
}) => {
  const isExistedEmail = await checkEmailExist(email);
  if (isExistedEmail) throw new Error("Email này đã được sử dụng");
  const hashedPassword = await bcrypt.hash(password, 10);
  let user = null;
  if (role) {
    user = await User.create({
      fullName,
      password: hashedPassword,
      email,
      phone,
      role,
      isActive: true,
    });
  }

  delete user.dataValues.password;

  return user;
};

// const refreshTokenService = async (refreshToken) => {
//   const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
//   const { _id } = decodedToken;
//   const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
//     .select("_id username email password phone role refreshToken")
//     .lean();
//   if (!user) throw new Error("There's something wrong");
//   if (user.refreshToken != refreshToken)
//     throw new Error("There's something wrong");

//   const token = jwt.sign(user, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
//   return {
//     access_token: token,
//   };
// };

const checkEmailExist = async (email) => {
  const foundUser = await User.findOne({ where: { email } });
  if (foundUser) return true;
  return false;
};

module.exports = {
  loginService,
  registerService,
  registerForAdminService,
  // refreshTokenService,
};
