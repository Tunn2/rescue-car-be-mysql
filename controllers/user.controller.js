const {
  updateUserByIdService,
  getStaffsService,
  getCustomersService,
  getAvailableStaffsService,
} = require("../services/user.service");

const getAvailableStaffsController = async (req, res) => {
  try {
    const result = await getAvailableStaffsService();
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getStaffsController = async (req, res) => {
  try {
    const result = await getStaffsService();
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCustomersController = async (req, res) => {
  try {
    const result = await getCustomersService();
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const updateUserByIdController = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const userId = req.userId;
    const result = await updateUserByIdService({ fullName, phone, userId });
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  updateUserByIdController,
  getStaffsController,
  getCustomersController,
  getAvailableStaffsController,
};
