import { Router } from "express";
import { userController } from "../controllers/userController.js";

const router = Router();

router.get("/", userController.list);
router.get("/me", userController.me);
router.get("/:userId", userController.show);

export default router;
