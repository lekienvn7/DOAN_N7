import exportExcelService from "./exportExcel.service.js";

export const exportElectricExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportElectricExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=kho-dien.xlsx");

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportChemicalExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportChemicalExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kho-hoaChat.xlsx"
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportAutomotiveExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportAutomotiveExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=kho-cnOto.xlsx");

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportFashionExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportFashionExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kho-thoiTrang.xlsx"
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportIotExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportIotExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kho-nhung.xlsx"
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportMechanicalExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportMechanicalExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kho-coKhi.xlsx"
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};

export const exportTechnologyExcel = async (req, res) => {
  try {
    const result = await exportExcelService.exportTechnologyExcelService();
    // ======= RESPONSE =======
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kho-cntt.xlsx"
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xuất Excel!" });
  }
};
