import express from "express";
import authenticate from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import {
  addLeaveType,
  deleteLeaveType,
  editLeaveType,
  leaveTypes,
} from "../controllers/leave-types.js";

const router = express.Router();

router.get("/", authenticate, leaveTypes);

router.post("/", authenticate, requireRole("admin"), addLeaveType);

router.put("/:id", authenticate, requireRole("admin"), editLeaveType);

router.delete("/:id", authenticate, requireRole("admin"), deleteLeaveType);

export default router;
