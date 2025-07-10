import express from "express";
import authenticate from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import { editProfile, getProfile } from "../controllers/profile.js";

const router = express.Router();

router.get("/", authenticate, getProfile);

router.put("/", authenticate, editProfile);

export default router;
