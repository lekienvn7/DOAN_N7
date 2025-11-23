import ExcelJS from "exceljs";
import Repository from "../repository/Repository.model.js";

async function exportElectricExcelService() {
  const repository = await Repository.findOne({
    repoType: "electric",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const electrical = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    voltageRange: item.material.voltageRange,
    power: item.material.power,
    current: item.material.current,
    frequency: item.material.frequency,
    resistance: item.material.resistance,
    phaseType: item.material.phaseType,
    conductorMaterial: item.material.conductorMaterial,
    insulationMaterial: item.material.insulationMaterial,
    fireResistance: item.material.fireResistance,
    cableDiameter: item.material.cableDiameter,
    waterproofLevel: item.material.waterproofLevel,
    operatingTemp: item.material.operatingTemp,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho điện");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "S1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO ĐIỆN";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Điện áp",
    "Công suất định mức",
    "Dòng điện định mức",
    "Tần số",
    "Điện trở",
    "Loại pha điện",
    "Vật liệu lõi",
    "Lớp bọc ngoài",
    "Khả năng chịu lửa",
    "Đường kính dây",
    "Mức độ bảo vệ",
    "Nhiệt độ hoạt động",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  electrical.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.voltageRange || "—",
      item.power || "—",
      item.current || "—",
      item.frequency || "—",
      item.resistance || "—",
      item.phaseType || "—",
      item.conductorMaterial || "—",
      item.insulationMaterial || "—",
      item.fireResistance || "—",
      item.cableDiameter || "—",
      item.waterproofLevel || "—",
      item.operatingTemp || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportChemicalExcelService() {
  const repository = await Repository.findOne({
    repoType: "chemical",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const chemical = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    chemicalFormula: item.material.chemicalFormula,
    concentration: item.material.concentration,
    hazardLevel: item.material.hazardLevel,
    storageTemperature: item.material.storageTemperature,
    boilingPoint: item.material.boilingPoint,
    meltingPoint: item.material.meltingPoint,
    molarMass: item.material.molarMass,
    phLevel: item.material.phLevel,
    expiryDate: item.material.expiryDate,
    flammability: item.material.flammability,
    toxicity: item.material.toxicity,
    safetyNote: item.material.safetyNote,
    casNumber: item.material.casNumber,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho hóa chất");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "T1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO HÓA CHẤT";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Công thức hoá học",
    "Nồng độ",
    "Mức độ nguy hiểm",
    "Nhiệt độ bảo quản",
    "Điểm sôi",
    "Điểm nóng chảy",
    "Khối lượng mol",
    "Độ pH",
    "Hạn sử dụng",
    "Tính dễ cháy",
    "Độc tính",
    "Ghi chú an toàn",
    "Số CAS",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  chemical.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.chemicalFormula || "—",
      item.concentration || "—",
      item.hazardLevel || "—",
      item.storageTemperature || "—",
      item.boilingPoint || "—",
      item.meltingPoint || "—",
      item.molarMass || "—",
      item.phLevel || "—",
      item.expiryDate || "—",
      item.flammability || "—",
      item.toxicity || "—",
      item.safetyNote || "—",
      item.casNumber || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportAutomotiveExcelService() {
  const repository = await Repository.findOne({
    repoType: "automotive",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const automotive = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    partType: item.material.partType,
    vehicleModel: item.material.vehicleModel,
    manufacturer: item.material.manufacturer,
    compatibility: item.material.compatibility,
    lifespan: item.material.lifespan,
    material: item.material.material,
    heatResistance: item.material.heatResistance,
    fluidSpec: item.material.fluidSpec,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho công nghệ ô tô");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "O1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO CÔNG NGHỆ Ô TÔ";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại bộ phận",
    "Dòng xe",
    "Nhà sản xuất",
    "Độ tương thích",
    "Tuổi thọ linh kiện",
    "Chất liệu",
    "Khả năng chịu nhiệt",
    "Quy chuẩn dầu, nhớt dùng kèm",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  automotive.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.partType || "—",
      item.vehicleModel || "—",
      item.manufacturer || "—",
      item.compatibility || "—",
      item.lifespan || "—",
      item.material || "—",
      item.heatResistance || "—",
      item.fluidSpec || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportFashionExcelService() {
  const repository = await Repository.findOne({
    repoType: "fashion",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const fashion = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    fabricType: item.material.fabricType,
    color: item.material.color,
    size: item.material.size,
    pattern: item.material.pattern,
    elasticity: item.material.elasticity,
    origin: item.material.origin,
    washInstruction: item.material.washInstruction,
    durability: item.material.durability,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho thời trang");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "O1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO THỜI TRANG";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại vải",
    "Màu sắc",
    "Kích cỡ",
    "Hoạ tiết",
    "Độ co giãn",
    "Xuất xứ",
    "Hướng dẫn giặt",
    "Độ bền",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  fashion.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.fabricType || "—",
      item.color || "—",
      item.size || "—",
      item.pattern || "—",
      item.elasticity || "—",
      item.origin || "—",
      item.washInstruction || "—",
      item.durability || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportIotExcelService() {
  const repository = await Repository.findOne({
    repoType: "iot",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const iot = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    sensorType: item.material.sensorType,
    cpuClock: item.material.cpuClock,
    communicationProtocol: item.material.communicationProtocol,
    wirelessTech: item.material.wirelessTech,
    powerSupply: item.material.powerSupply,
    ioPins: item.material.ioPins,
    memory: item.material.memory,
    operatingTemp: item.material.operatingTemp,
    interface: item.material.interface,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho nhúng và iot");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "P1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO NHÚNG VÀ IOT";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại cảm biến",
    "Xung nhịp CPU",
    "Giao thức truyền thông",
    "Công nghệ không dây",
    "Nguồn cấp điện",
    "Số chân I/O",
    "Bộ nhớ",
    "Nhiệt độ hoạt động",
    "Giao tiếp kết nối",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  iot.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.sensorType || "—",
      item.cpuClock || "—",
      item.communicationProtocol || "—",
      item.wirelessTech || "—",
      item.powerSupply || "—",
      item.ioPins || "—",
      item.memory || "—",
      item.operatingTemp || "—",
      item.interface || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportMechanicalExcelService() {
  const repository = await Repository.findOne({
    repoType: "mechanical",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const mechanical = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    metalType: item.material.metalType,
    hardness: item.material.hardness,
    tensileStrength: item.material.tensileStrength,
    weight: item.material.weight,
    coating: item.material.coating,
    thickness: item.material.thickness,
    size: item.material.size,
    tolerance: item.material.tolerance,
    loadCapacity: item.material.loadCapacity,
    heatResistance: item.material.heatResistance,
    corrosionResistance: item.material.corrosionResistance,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho cơ khí");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "R1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO CƠ KHÍ";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại kim loại",
    "Độ cứng",
    "Độ bền kéo",
    "Khối lượng",
    "Lớp phủ",
    "Độ dày",
    "Kích thước",
    "Sai số / dung sai",
    "Tải trọng chịu được",
    "Khả năng chịu nhiệt",
    "Khả năng chống ăn mòn",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  mechanical.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.metalType || "—",
      item.hardness || "—",
      item.tensileStrength || "—",
      item.weight || "—",
      item.coating || "—",
      item.thickness || "—",
      item.size || "—",
      item.tolerance || "—",
      item.loadCapacity || "—",
      item.heatResistance || "—",
      item.corrosionResistance || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportTechnologyExcelService() {
  const repository = await Repository.findOne({
    repoType: "technology",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const technology = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    deviceType: item.material.deviceType,
    capacity: item.material.capacity,
    speed: item.material.speed,
    brand: item.material.brand,
    connectorType: item.material.connectorType,
    powerConsumption: item.material.powerConsumption,
    protocol: item.material.protocol,
    networkInterface: item.material.networkInterface,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho công nghệ thông tin");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "O1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO CÔNG NGHỆ THÔNG TIN";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại thiết bị",
    "Dung lượng",
    "Tốc độ",
    "Thương hiệu",
    "Loại cổng kết nối",
    "Mức tiêu thụ điện",
    "Giao thức",
    "Chuẩn giao tiếp mạng / Giao diện mạng",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  technology.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.deviceType || "—",
      item.capacity || "—",
      item.speed || "—",
      item.brand || "—",
      item.connectorType || "—",
      item.powerConsumption || "—",
      item.protocol || "—",
      item.networkInterface || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

async function exportTelecomExcelService() {
  const repository = await Repository.findOne({
    repoType: "telecom",
  }).populate({
    path: "materials.material",
    populate: { path: "detail" }, // hoặc electricDetail, hoặc field chứa model con
  });

  const telecom = repository.materials.map((item) => ({
    name: item.material.name,
    quantity: item.quantity,
    unit: item.material.unit,
    maintenanceCycle: item.material.maintenanceCycle,
    createdAt: item.material.createdAt,
    signalType: item.material.signalType,
    frequency: item.material.frequency,
    bandwidth: item.material.bandwidth,
    connectorType: item.material.connectorType,
    cableType: item.material.cableType,
    transmissionRate: item.material.transmissionRate,
    range: item.material.range,
    impedance: item.material.impedance,
    description: item.material.description,
  }));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kho điện tử viễn thông");

  // ======= STYLE =======
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDD700" }, // vàng đậm
  };

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ======= TITLE =======
  sheet.mergeCells("A1", "O1");
  const title = sheet.getCell("A1");
  title.value = "BÁO CÁO DANH SÁCH VẬT TƯ KHO ĐIỆN TỬ VIỄN THÔNG";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };
  title.fill = headerFill;

  // ======= HEADER =======
  sheet.addRow([
    "STT",
    "Tên vật tư",
    "Số lượng",
    "Đơn vị",
    "Hạn bảo trì",
    "Ngày thêm",
    "Loại tín hiệu",
    "Tần số",
    "Băng thông",
    "Loại đầu nối",
    "Loại cáp",
    "Tốc độ truyền dẫn",
    "Phạm vi hoạt động",
    "Trở kháng",
    "Ghi chú",
  ]);

  const headerRow = sheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // ======= DATA =======
  technology.forEach((item, index) => {
    const row = sheet.addRow([
      index + 1,
      item.name,
      item.quantity,
      item.unit,
      item.maintenanceCycle || "—",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      item.deviceType || "—",
      item.capacity || "—",
      item.speed || "—",
      item.brand || "—",
      item.connectorType || "—",
      item.powerConsumption || "—",
      item.protocol || "—",
      item.networkInterface || "—",
      item.description || "",
    ]);

    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Cột tên căn trái cho đẹp
    row.getCell(2).alignment = { horizontal: "left" };
  });

  // ======= AUTO WIDTH =======
  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 0;
      if (len > max) max = len;
    });
    col.width = max + 2;
  });

  const result = await workbook.xlsx.writeBuffer();
  return result;
}

export default {
  exportElectricExcelService,
  exportChemicalExcelService,
  exportAutomotiveExcelService,
  exportFashionExcelService,
  exportIotExcelService,
  exportMechanicalExcelService,
  exportTechnologyExcelService,
  exportTelecomExcelService,
};
