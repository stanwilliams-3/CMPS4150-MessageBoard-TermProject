import { ObjectId } from "mongodb";
import { MessageModel } from "../models/MessageModel.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";

/**
 * Wire in routes (example):
 *   router.post("/:topicId", messageController.create);
 * mounted at app.use("/messages", messagesRouter)
 * → POST /messages/<topicId>  with body { body: "text" } (JSON or form field "body")
 *
 * Login: set req.session.userId to the user's ObjectId (string) when they sign in.
 */
export const messageController = {
  async create(req, res, next) {
    try {
      // 1) Who is posting? (session is set by your auth flow, not here)
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

      // 2) Which topic? (from the URL param when you define the route)
      let topicId;
      try {
        topicId = new ObjectId(String(req.params.topicId));
      } catch {
        return res.status(400).send("Invalid topic id.");
      }

      // 3) Read and validate message text
      const text = typeof req.body?.body === "string" ? req.body.body.trim() : "";
      if (!text) {
        return res.status(400).send("Message cannot be empty.");
      }

      // 4) Rule: only subscribers may post (same fields as in seed.js)
      const isSubscribed = await SubscriptionModel.isSubscribed(userId, topicId);
      if (!isSubscribed) {
        return res.status(403).send("You are not subscribed to this topic.");
      }

      // 5) Save using the model (controller never calls insertOne directly)
      await MessageModel.insert(topicId, userId, text);

      // 6) Respond — forms usually want a redirect, not JSON
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
};
