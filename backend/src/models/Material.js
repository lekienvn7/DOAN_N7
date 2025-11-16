import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    materialID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      // Tên
      type: String,
      required: true,
      unique: true, // => Bắt buộc phải điền giá trị
      trim: true,
    },
    maintenanceCycle: {
      // Thời gian giữa các lần bảo trì
      type: Number, // tính theo tháng
      default: null, // mặc định: 1 tháng bảo trì 1 lần
      min: 1,
    },
    type: [
      {
        // Loại vật liệu
        type: String,
        enum: [
          "electric",
          "chemical",
          "mechanical",
          "iot",
          "technology",
          "automotive",
          "telecom",
          "fashion",
        ],
        required: true,
        trim: true,
      },
    ],
    status: {
      // Trạng thái vât liệu
      type: String,
      enum: ["Trong kho", "Đang mượn", "Đang bảo trì"],
      default: "Trong kho",
    },
    quantity: {
      // Số lượng
      type: Number,
      default: 0,
      min: 1,
    },

    avatarMaterialUrl: {
      type: String,
    },
    avatarMaterialID: {
      type: String,
    },
    unit: {
      type: String,
      default: "cái", // Đơn vị tính, ví dụ: cái, cuộn, mét...
    },
    description: {
      type: String,
      default: "", // Mô tả chi tiết vật tư
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // ====== ĐẶC ĐIỂM VẬT TƯ ĐIỆN ====== //
    voltageRange: {
      type: String,
      default: null,
    },
    power: {
      type: Number,
      default: null,
    },
    materialInsulation: {
      type: String,
      enum: ["Dẫn điện", "Cách điện"],
      default: null,
    },
    current: {
      type: Number,
      default: null,
    },
    frequency: {
      type: Number,
      default: null,
    }, // Tần số (Hz)
    resistance: {
      type: Number,
      default: null,
    }, // Điện trở (ohm)
    phaseType: {
      type: String,
      default: null,
    }, // 1 pha / 3 pha
    conductorMaterial: {
      type: String,
      default: null,
    }, // Đồng / Nhôm
    insulationMaterial: {
      type: String,
      default: null,
    }, // PVC, XLPE...
    fireResistance: {
      type: String,
      default: null,
    }, // Chống cháy bao nhiêu phút
    cableDiameter: {
      type: String,
      default: null,
    }, // Đường kính dây
    waterproofLevel: {
      type: String,
      default: null,
    },
    operatingTemp: {
      type: String,
      default: null,
    },
    
    
    // ====== ĐẶC ĐIỂM VẬT TƯ HÓA CHẤT ====== //
    chemicalFormula: {
      type: String,
      default: null,
    }, // H2SO4, NaCl...
    concentration: {
      type: String,
      default: null,
    }, // Nồng độ %
    hazardLevel: {
      type: String,
      default: null,
    }, // Mức độ nguy hiểm
    storageTemperature: {
      type: String,
      default: null,
    }, // Nhiệt độ lưu trữ
    boilingPoint: {
      type: String,
      default: null,
    }, // Điểm sôi
    meltingPoint: {
      type: String,
      default: null,
    }, // Điểm nóng chảy
    molarMass: {
      type: String,
      default: null,
    }, // Khối lượng mol
    phLevel: {
      type: String,
      default: null,
    }, // Độ pH
    expiryDate: {
      type: Date,
      default: null,
    }, // Hạn sử dụng
    flammability: {
      type: String,
      default: null,
    }, // Dễ cháy mức độ?
    toxicity: {
      type: String,
      default: null,
    }, // Độc tính
    safetyNote: {
      type: String,
      default: null,
    }, // Ghi chú an toàn
    casNumber: {
      type: String,
      default: null,
    },

    // ====== ĐẶC ĐIỂM VẬT TƯ CƠ KHÍ ====== //
    metalType: {
      type: String,
      default: null,
    }, // Thép, inox, đồng...
    hardness: {
      type: String,
      default: null,
    }, // Độ cứng (HRC)
    tensileStrength: {
      type: String,
      default: null,
    }, // Độ bền kéo
    weight: {
      type: Number,
      default: null,
    }, // Trọng lượng
    coating: {
      type: String,
      default: null,
    }, // Mạ kẽm / mạ niken
    thickness: {
      type: String,
      default: null,
    }, // Độ dày
    size: {
      type: String,
      default: null,
    }, // Kích thước tổng thể
    tolerance: {
      type: String,
      default: null,
    }, // Dung sai
    loadCapacity: {
      type: String,
      default: null,
    }, // Khả năng chịu tải
    heatResistance: {
      type: String,
      default: null,
    }, // Chịu nhiệt độ
    corrosionResistance: {
      type: String,
      default: null,
    }, // Chống ăn mòn

    // ====== ĐẶC ĐIỂM VẬT TƯ NHÚNG VÀ IOT ====== //
    sensorType: {
      type: String,
      default: null,
    }, // nhiệt độ, độ ẩm, ánh sáng…
    cpuClock: {
      type: String,
      default: null,
    }, // Tốc độ CPU
    communicationProtocol: {
      type: String,
      default: null,
    }, // I2C, SPI, UART
    wirelessTech: {
      type: String,
      default: null,
    }, // WiFi, BLE, LoRa…
    powerSupply: {
      type: String,
      default: null,
    }, // 3.3V / 5V
    ioPins: {
      type: Number,
      default: null,
    }, // Số chân I/O
    memory: {
      type: String,
      default: null,
    }, // Flash / RAM
    operatingTemp: {
      type: String,
      default: null,
    }, // Nhiệt độ hoạt động
    interface: {
      type: String,
      default: null,
    }, // GPIO, ADC, DAC…
    // ====== ĐẶC ĐIỂM VẬT TƯ CÔNG NGHỆ THÔNG TIN ====== //
    deviceType: {
      type: String,
      default: null,
    }, // SSD / RAM / ROUTER
    capacity: {
      type: String,
      default: null,
    }, // 256GB / 1TB / 8GB
    speed: {
      type: String,
      default: null,
    }, // 3200MHz / 540MBps / 1Gbps
    brand: {
      type: String,
      default: null,
    }, // Dell, HP, Kingston…
    connectorType: {
      type: String,
      default: null,
    }, // SATA / NVMe / PCIe
    powerConsumption: {
      type: String,
      default: null,
    }, // Công suất tiêu thụ
    protocol: {
      type: String,
      default: null,
    }, // SMB, FTP, HTTP
    networkInterface: {
      type: String,
      default: null,
    }, // Ethernet / Fiber
    warranty: {
      type: String,
      default: null,
    }, // Bảo hành
    // ====== ĐẶC ĐIỂM VẬT TƯ CÔNG NGHỆ OTO ====== //
    partType: {
      type: String,
      default: null,
    }, // lọc dầu / phanh / bugi
    vehicleModel: {
      type: String,
      default: null,
    }, // Mazda 3 / Vios…
    manufacturer: {
      type: String,
      default: null,
    }, // Honda / Toyota
    compatibility: {
      type: String,
      default: null,
    }, // Phù hợp dòng xe nào
    lifespan: {
      type: String,
      default: null,
    }, // Tuổi thọ
    material: {
      type: String,
      default: null,
    }, // Chất liệu phụ tùng
    heatResistance: {
      type: String,
      default: null,
    }, // Chịu nhiệt độ
    fluidSpec: {
      type: String,
      default: null,
    }, // Chuẩn dầu / nhớt

    // ====== ĐẶC ĐIỂM VẬT TƯ ĐIỆN TỬ VIỄN THÔNG ====== //
    signalType: {
      type: String,
      default: null,
    }, // Analog / Digital
    frequency: {
      type: String,
      default: null,
    }, // 2.4GHz / 5GHz…
    bandwidth: {
      type: String,
      default: null,
    }, // 40MHz / 80MHz
    connectorType: {
      type: String,
      default: null,
    }, // SMA / BNC / RJ45
    cableType: {
      type: String,
      default: null,
    }, // UTP / STP / Fiber
    transmissionRate: {
      type: String,
      default: null,
    }, // 100Mbps / 1Gbps
    range: {
      type: String,
      default: null,
    }, // Tầm phát sóng
    impedance: {
      type: String,
      default: null,
    }, // 50Ω / 75Ω

    // ====== ĐẶC ĐIỂM VẬT TƯ THIẾT KẾ THỜI TRANG ====== //
    fabricType: {
      type: String,
      default: null,
    }, // Cotton / Lụa / Kaki
    color: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    pattern: {
      type: String,
      default: null,
    }, // Họa tiết
    elasticity: {
      type: String,
      default: null,
    }, // Độ co giãn
    origin: {
      type: String,
      default: null,
    }, // Xuất xứ
    washInstruction: {
      type: String,
      default: null,
    }, // HDSD giặt
    durability: {
      type: String,
      default: null,
    }, // Độ bền màu
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
