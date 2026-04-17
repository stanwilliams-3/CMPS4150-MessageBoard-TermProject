import { ObjectId } from "mongodb";
import { MessageModel } from "../models/MessageModel.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";

export const messageController = {
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


      let topicId;
      try {
        topicId = new ObjectId(String(req.params.topicId));
      } catch {
        return res.status(400).send("Invalid topic id.");
      }

      const text = typeof req.body?.body === "string" ? req.body.body.trim() : "";
      if (!text) {
        return res.status(400).send("Message cannot be empty.");
      }

      const isSubscribed = await SubscriptionModel.isSubscribed(userId, topicId);
      if (!isSubscribed) {
        return res.status(403).send("You are not subscribed to this topic.");
      }

      await MessageModel.insert(topicId, userId, text);

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
};
