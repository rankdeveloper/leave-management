import express from "express";
import authenticate from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import {
  adminApproveRequest,
  adminLeaveRequests,
  employeeDeletePending,
  employeeEditLeave,
  employeeLeavePost,
  employeeLeaveRequest,
} from "../controllers/leave-requests.js";

const router = express.Router();

// admin - all req
router.get("/all", authenticate, requireRole("admin"), adminLeaveRequests);

// emp: onw leave req
router.get("/", authenticate, requireRole("employee"), employeeLeaveRequest);

// emp - apply leave
router.post("/", authenticate, requireRole("employee"), employeeLeavePost);

// emp - editpending leave req
router.put("/:id", authenticate, requireRole("employee"), employeeEditLeave);

// emp delete pending leave rq
router.delete(
  "/:id",
  authenticate,
  requireRole("employee"),
  employeeDeletePending
);

// admin - approve request
router.patch(
  "/:id/status",
  authenticate,
  requireRole("admin"),
  adminApproveRequest
);

export default router;
