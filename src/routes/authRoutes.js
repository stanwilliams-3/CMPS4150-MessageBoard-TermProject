import express from "express";
import {
  showRegisterPage,
  register,
  showLoginPage,
  login,
  logout
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", showRegisterPage);
router.post("/register", register);

router.get("/login", showLoginPage);
router.post("/login", login);

router.post("/logout", logout);

export default router;