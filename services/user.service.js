const User = require("../models/user.model");

const findUserByIdService = async (id) => {
  const user = await User.findByPk(id);
  if (user) return user.dataValues;
  return null;
};
module.exports = {
  findUserByIdService,
};
