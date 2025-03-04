const {
  createAServiceService,
  getServicesService,
  deleteServiceByIdService,
  getServicesByPackageIdService,
} = require("../services/service.service");

const deleteServiceByIdController = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ errorCode: 1, message: "Thiếu serviceId" });
    }

    const result = await deleteServiceByIdService(serviceId);

    return res
      .status(200)
      .json({ success: true, message: "Xóa dịch vụ thành công", result });
  } catch (error) {
    return res.status(500).json({ errorCode: 1, message: error.message });
  }
};

const createAServiceController = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ errorCode: 1, message: "Thiếu thông tin name hoặc price" });
    }

    const result = await createAServiceService({ name, price });

    return res.status(201).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      result,
    });
  } catch (error) {
    return res.status(500).json({ errorCode: 1, message: error.message });
  }
};

const getServicesController = async (req, res) => {
  try {
    const result = await getServicesService();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ errorCode: 1, message: error.message });
  }
};

const getServicesByPackageIdController = async (req, res) => {
  try {
    const result = await getServicesByPackageIdService(req.params.packageId);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createAServiceController,
  getServicesController,
  deleteServiceByIdController,
  getServicesByPackageIdController,
};
