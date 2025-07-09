import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import leaveTypeRoutes from "./routes/leaveTypes.js";
import leaveRequestRoutes from "./routes/leaveRequests.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
