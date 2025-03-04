const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác thực tài khoản của bạn",
    html: `<p>Nhấp vào liên kết sau để xác thực tài khoản:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  });
};

module.exports = sendVerificationEmail;
