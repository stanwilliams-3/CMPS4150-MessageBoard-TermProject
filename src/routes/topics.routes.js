import { Router } from "express";
import { topicController } from "../controllers/topicController.js";

const router = Router();

router.post("/", topicController.create);

export default router;
