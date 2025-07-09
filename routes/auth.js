import { loginController, signupController } from "../controllers/auth.js";
import express from "express";
const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);

export default router;
