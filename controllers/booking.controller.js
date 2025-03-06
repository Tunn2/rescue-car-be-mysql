const {
  createBookingService,
  getBookingsService,
  assignStaffsService,
  getBookingsByStaffsIdService,
  updateBookingStatusByIdService,
  getBookingsByUserIdService,
  getBookingByIdService,
} = require("../services/booking.service");

const getBookingByIdController = async (req, res) => {
  try {
    const result = await getBookingByIdService(req.params.bookingId);
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getBookingsByUserIdController = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getBookingsByUserIdService(userId);
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const updateBookingStatusByIdController = async (req, res) => {
  try {
    const { status, services } = req.body;
    const { bookingId } = req.params;

    console.log("siu");
    return res.send(
      await updateBookingStatusByIdService({
        bookingId,
        status,
        services,
      })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getBookingsByStaffsIdController = async (req, res) => {
  try {
    // const { staff1, staff2 } = req.body;
    const { staffId } = req.params;
    const result = await getBookingsByStaffsIdService(staffId);
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getBookingsController = async (req, res) => {
  try {
    const result = await getBookingsService();
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createBookingController = async (req, res) => {
  try {
    const { carId, location, evidence, description, phone } = req.body;
    const userId = req.userId;
    const result = await createBookingService({
      carId,
      description,
      evidence,
      location,
      phone,
      userId,
    });
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const assignStaffsController = async (req, res) => {
  try {
    const { staff1, staff2 } = req.body;
    const { bookingId } = req.params;
    const result = assignStaffsService({ bookingId, staff1, staff2 });
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createBookingController,
  getBookingsController,
  assignStaffsController,
  getBookingsByStaffsIdController,
  updateBookingStatusByIdController,
  getBookingsByUserIdController,
  getBookingByIdController,
};
