import express from "express";
import homeRoutes from "./routes/homeRoutes.js";
import materialRoutes from "./modules/material/material.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import permissionRoutes from "./modules/permission/permission.routes.js";
import roleRoutes from "./modules/role/role.routes.js";
import repoRoutes from "./modules/repository/repository.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";
import maintenanceRoutes from "./modules/maintenance/maintenance.routes.js";
import exportExcel from "./modules/exportExcel/exportExcel.routes.js";
import borrowRequestRoutes from "./modules/borrowRequest/borrowRequest.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const server = http.createServer(app);
initSocket(server);

app.use(express.json());
app.use(cookieParser());

app.use("/api/home", homeRoutes);

app.use("/api/material", materialRoutes);

app.use("/api/permission", permissionRoutes);

app.use("/api/user", userRoutes);

app.use("/api/role", roleRoutes);

app.use("/api/repository", repoRoutes);

app.use("/api/transaction", transactionRoutes);

app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/export", exportExcel);

app.use("/api/auth", authRoutes);

app.use("/api/borrow-requests", borrowRequestRoutes);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Bắt đầu ở cổng ${PORT}`);
  });
});
