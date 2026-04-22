import { DriverObjectId } from "../db/driverObjectId.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";
import { TopicModel } from "../models/TopicModel.js";
import { appEventBus, AppEvents } from "../observers/AppEventBus.js";

export const subscriptionController = {
  async subscribe(req, res, next) {
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
        topicId = new DriverObjectId(String(req.body.topicId));
      } catch {
        return res.status(400).send("Invalid topic id.");
      }

      await SubscriptionModel.subscribe(userId, topicId);
      await TopicModel.incrementAccess(topicId);
      appEventBus.publish(AppEvents.TOPIC_SUBSCRIBED, {
        userId: String(userId),
        topicId: String(topicId),
      });

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
        userId = new DriverObjectId(String(userIdRaw));
      } catch {
        return res.status(500).send("Session user id is invalid.");
      }

      let topicId;
      try {
        topicId = new DriverObjectId(String(req.body.topicId));
      } catch {
        return res.status(400).send("Invalid topic id.");
      }

      await SubscriptionModel.unsubscribe(userId, topicId);

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
};
