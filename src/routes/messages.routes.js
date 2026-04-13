import { Router } from "express";
import { messageController } from "../controllers/messageController.js";

const router = Router();

// POST /messages/<topicId>  (body field "body" = message text)
router.post("/:topicId", messageController.create);

export default router;
