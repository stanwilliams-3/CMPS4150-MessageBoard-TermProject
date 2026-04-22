import { DriverObjectId } from "../db/driverObjectId.js";
import { MessageModel } from "../models/MessageModel.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";
import { TopicModel } from "../models/TopicModel.js";
import { appEventBus, AppEvents } from "../observers/AppEventBus.js";

export const messageController = {
  async create(req, res, next) {
    try {
      const userIdRaw = req.session?.userId;
      if (!userIdRaw) {
        return res.redirect("/auth/login");
      }

      let userId;
      try {
        userId = new DriverObjectId(String(userIdRaw));
      } catch {
        return res.status(500).send("Session user id is invalid.");
      }

      let topicId;
      try {
        topicId = new DriverObjectId(String(req.params.topicId));
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

      const messageId = await MessageModel.insert(topicId, userId, text);
      await TopicModel.incrementAccess(topicId);
      appEventBus.publish(AppEvents.MESSAGE_CREATED, {
        messageId: String(messageId),
        topicId: String(topicId),
        userId: String(userId),
      });

      res.redirect(`/?flash=${encodeURIComponent("Message posted.")}`);
    } catch (err) {
      next(err);
    }
  },
};
