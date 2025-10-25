import Equipment from "../models/Equipment.jsx";

export const getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.status(200).json({
      success: true,
      message: "Lấy danh sách thiết bị thành công!",
      data: equipments,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllEquipments:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const { equipmentName, quantity, type, maintenanceCycle } = req.body;

    // --- Kiểm tra thiếu thông tin ---
    if (
      !equipmentName ||
      quantity == null ||
      !type ||
      maintenanceCycle == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin thiết bị bắt buộc!",
      });
    }

    //  Kiểm tra giá trị không hợp lệ
    if (quantity < 0 || maintenanceCycle < 1) {
      return res.status(400).json({
        success: false,
        message: "Giá trị bạn nhập không phù hợp!",
      });
    }

    // Sinh mã thiết bị tự động
    const count = await Equipment.countDocuments();
    const equipmentID = `TB${String(count + 1).padStart(3, "0")}`; // ví dụ: TB001, TB002,...

    // Nếu type chỉ là 1 giá trị, ép về mảng
    const typeArray = Array.isArray(type) ? type : [type];

    // Tạo thiết bị mới
    const newEquipment = await Equipment.create({
      equipmentID,
      equipmentName,
      quantity,
      type: typeArray,
      maintenanceCycle,
    });

    // Trả phản hồi thành công
    return res.status(201).json({
      success: true,
      message: "Thêm thiết bị thành công!",
      data: newEquipment,
    });
  } catch (error) {
    console.error("Lỗi khi thêm thiết bị:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Không thể thêm thiết bị!",
      error: error.message,
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { equipmentName, quantity, type, maintenanceCycle, status } =
      req.body;

    const updatedEquipment = await Equipment.findOneAndUpdate(
      { equipmentID: req.params.id },
      {
        equipmentName,
        quantity,
        type: Array.isArray(type) ? type : [type],
        maintenanceCycle,
        status,
      },
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({
        success: false,
        message: "Thiết bị không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thiết bị thành công!",
      data: updatedEquipment,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateEquipment:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thiết bị để xóa!",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa thiết bị ${equipment.equipmentName} thành công!`,
    });
  } catch (error) {
    console.error("Lỗi khi xóa thiết bị:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Không thể xóa thiết bị!",
      error: error.message,
    });
  }
};
