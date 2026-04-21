import { Router } from "express";
import { subscriptionController } from "../controllers/subscriptionController.js";

const router = Router();

router.post("/subscribe", subscriptionController.subscribe);

export default router;
