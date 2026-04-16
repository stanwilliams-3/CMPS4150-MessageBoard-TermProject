import { SubscriptionModel } from "../models/SubscriptionModel.js";
import { ObjectId } from "mongodb";


export const subscriptionController = {
    async subscribe(req, res, next) {
        try {
            const userIdRaw = req.session?.userId;
            if (!userIdRaw) {
                return res.redirect("/auth/login");
            }

            let userId;
            try {
                userId = new ObjectId(String(userIdRaw));
            } catch {
                return res.status(500).send("Session user id is invalid.");
            }

            let topicId;
            try {
                topicId = new ObjectId(String(req.body.topicId));
            } catch {
                return res.status(400).send("Invalid topic id.");
            }

            await SubscriptionModel.subscribe(userId, topicId);

            res.redirect("/topics");
        } catch (err) {
            next(err);
        }
    },
    async unsubscribe(req, res, next) {
        try {
            const userIdRaw = req.session?.userId;
            if (!userIdRaw) {
                return res.redirect("/auth/login");
            }
        
            let userId;
            try {
                userId = new ObjectId(String(userIdRaw));
            } catch {
                return res.status(500).send("Session user id is invalid.");
            }

            let topicId;
            try {
                topicId = new ObjectId(String(req.body.topicId));
            } catch {
                return res.status(400).send("Invalid topic id.");
            }

            await SubscriptionModel.unsubscribe(userId, topicId);

            res.redirect("/");
        } catch (err) {
            next(err);
        }
    
    }
}
