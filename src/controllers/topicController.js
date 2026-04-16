import { TopicModel } from "../models/TopicModel.js";
import { ObjectId } from "mongodb";

export const topicController = {
    async create(req, res, next) {
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

            const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
            if (!title) {
                return res.status(400).send("Topic title is required.");
            }

            const topicId = await TopicModel.insert(title, userId);
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
};
