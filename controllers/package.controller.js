const {
  createAPackageService,
  getPackagesService,
  getPackageByIdService,
} = require("../services/package.service");

const getPackageByIdController = async (req, res) => {
  try {
    const { packageId } = req.params;
    const result = await getPackageByIdService(packageId);
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getPackagesController = async (req, res) => {
  try {
    const result = await getPackagesService();
    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createAPackageController = async (req, res) => {
  try {
    const { name, price, services, description } = req.body;
    const result = await createAPackageService({
      name,
      price,
      description,
      services,
    });

    return res.send({ status: 200, result });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createAPackageController,
  getPackagesController,
  getPackageByIdController,
};
