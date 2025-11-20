import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  permissionID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  permissionName: {
    type: String,
    required: true,
    unique: true,
  },
  permissionDescription: {
    type: String,
    default: "",
  },
});

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
