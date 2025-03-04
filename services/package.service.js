const Package = require("../models/package.model");
const Service = require("../models/service.model");

const getPackageByIdService = async (id) => {
  if (!id) throw new Error("ID không hợp lệ");

  const foundPackage = await Package.findOne({
    where: { id },
    raw: true,
  });

  if (!foundPackage) throw new Error("Không tìm thấy gói này");
  return foundPackage;
};

const getPackagesService = async () => {
  const packages = await Package.findAll({
    include: {
      model: Service,
      as: "services",
      through: { attributes: [] }, // Bỏ các thuộc tính của bảng trung gian nếu có
    },
    order: [["createdAt", "DESC"]],
  });

  return packages;
};

const createAPackageService = async ({
  name,
  price,
  description,
  services,
}) => {
  const foundPackage = await Package.findOne({
    where: { name },
    attributes: ["name"],
    raw: true,
  });

  if (foundPackage) throw new Error("Gói này đã tồn tại");

  const newPackage = await Package.create({
    name,
    price,
    description,
  });

  if (services && services.length > 0) {
    await newPackage.addServices(services); // Gán các dịch vụ vào package
  }

  const packageResult = await Package.findOne({
    where: { name },

    include: [
      { model: Service, as: "services", attributes: ["id", "name", "price"] },
    ],
    raw: true,
  });

  return packageResult;
};

module.exports = {
  createAPackageService,
  getPackagesService,
  getPackageByIdService,
};
