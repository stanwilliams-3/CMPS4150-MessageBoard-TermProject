import { Router } from "express";
import { subscriptionController } from "../controllers/subscriptionController.js";

const router = Router();

router.post("/subscribe", subscriptionController.subscribe);
router.post("/unsubscribe", subscriptionController.unsubscribe);

export default router;
