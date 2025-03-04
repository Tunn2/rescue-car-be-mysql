const Package = require("../models/package.model");
const Service = require("../models/service.model");

const createAServiceService = async ({ name, price }) => {
  const foundService = await Service.findOne({
    where: { name },
    raw: true,
  });

  if (foundService) throw new Error("Dịch vụ này đã tồn tại");

  await Service.create({ name, price });

  const service = await Service.findOne({
    where: { name },
    raw: true,
  });

  return service;
};

const getServicesService = async () => {
  const services = await Service.findAll({
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  return services;
};

const getServicesByPackageIdService = async (packageId) => {
  try {
    const packageWithServices = await Package.findByPk(packageId, {
      include: {
        model: Service,
        as: "services",
        through: { attributes: [] },
      },
    });

    console.log(packageWithServices);

    return packageWithServices ? packageWithServices.Services : [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách dịch vụ:", error);
    throw new Error("Không thể lấy danh sách dịch vụ.");
  }
};

const deleteServiceByIdService = async (id) => {
  await Service.destroy({ where: { id } });
  return true;
};

module.exports = {
  createAServiceService,
  getServicesService,
  deleteServiceByIdService,
  getServicesByPackageIdService,
};
