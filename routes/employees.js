import express from "express";
import authenticate from "../middleware/auth.js";
import requireRole from "../middleware/role.js";

import {
  addEmployee,
  deleteEmployee,
  editEmployee,
  getEmployees,
} from "../controllers/employees.js";

const router = express.Router();

router.post("/", authenticate, requireRole("admin"), addEmployee);

router.get("/", authenticate, getEmployees);

router.put("/:id", authenticate, requireRole("admin"), editEmployee);

router.delete("/:id", authenticate, requireRole("admin"), deleteEmployee);

export default router;
