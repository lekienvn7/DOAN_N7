import express from "express";
import homeRoutes from "./routes/homeRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import repoRoutes from "./routes/repoRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/home", homeRoutes);

app.use("/api/material", materialRoutes);

app.use("/api/permission", permissionRoutes);

app.use("/api/user", userRoutes);

app.use("/api/role", roleRoutes);

app.use("/api/repo", repoRoutes);

app.use("/api/transaction", transactionRoutes);

app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/login", loginRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Bắt đầu ở cổng ${PORT}`);
  });
});
