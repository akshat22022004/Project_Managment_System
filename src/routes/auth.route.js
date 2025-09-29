import { Router } from "express";
import authController from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(authController.registerUser);

export default router; // <-- default export
