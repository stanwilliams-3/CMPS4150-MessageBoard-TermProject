import { DriverObjectId } from "../db/driverObjectId.js";
import mongoose from "mongoose";
import { TopicModel } from "../models/TopicModel.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";
import { MessageModel } from "../models/MessageModel.js";
import User from "../models/User.js";
import { layoutPage } from "../html/layout.js";
import { topicsMainHtml, topicThreadMainHtml } from "../html/pageTemplates.js";

export const topicController = {
  async list(req, res, next) {
    try {
      const topicDocs = await TopicModel.listAll();
      let subscribedIds = new Set();
      const userIdRaw = req.session?.userId;
      if (userIdRaw) {
        try {
          const userId = new DriverObjectId(String(userIdRaw));
          const ids = await SubscriptionModel.listTopicIdsForUser(userId);
          subscribedIds = new Set(ids.map((id) => String(id)));
        } catch {
          subscribedIds = new Set();
        }
      }

      const topics = topicDocs.map((doc) => ({
        topicId: String(doc._id),
        title: doc.title,
        isSubscribed: subscribedIds.has(String(doc._id)),
        accessCount: Number(doc.accessCount || 0),
      }));

      const flash =
        typeof req.query?.flash === "string" && req.query.flash.trim()
          ? req.query.flash.trim()
          : undefined;

      res.type("html").send(
        layoutPage({
          title: "Topics",
          user: req.session?.username
            ? { username: req.session.username }
            : null,
          mainHtml: topicsMainHtml({ flash, topics }),
        })
      );
    } catch (err) {
      next(err);
    }
  },

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

      const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
      if (!title) {
        return res.status(400).send("Topic title is required.");
      }

      const topicId = await TopicModel.insert(title, userId);
      await SubscriptionModel.subscribe(userId, topicId);
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const userIdRaw = req.session?.userId;
      if (!userIdRaw) {
        return res.redirect("/auth/login");
      }

      let userId;
      let topicId;
      try {
        userId = new DriverObjectId(String(userIdRaw));
        topicId = new DriverObjectId(String(req.params.topicId));
      } catch {
        return res.status(400).send("Invalid id.");
      }

      const topic = await TopicModel.findById(topicId);
      if (!topic) {
        return res.status(404).send("Topic not found.");
      }

      await TopicModel.incrementAccess(topicId);
      const isSubscribed = await SubscriptionModel.isSubscribed(userId, topicId);
      const rawMessages = await MessageModel.listByTopic(topicId, 100);

      const authorObjectIds = [...new Set(
        rawMessages
          .map((m) => (m.userId ? String(m.userId) : null))
          .filter(Boolean)
      )].map((id) => new mongoose.Types.ObjectId(id));
      const usernameById = await User.usernameMapByIds(authorObjectIds);

      const messages = rawMessages.map((m) => ({
        authorName: usernameById.get(String(m.userId)) ?? "Unknown",
        createdAt: m.createdAt,
        body: m.body,
      }));

      res.type("html").send(
        layoutPage({
          title: topic.title,
          user: req.session?.username ? { username: req.session.username } : null,
          mainHtml: topicThreadMainHtml({
            topicId: String(topicId),
            topicTitle: topic.title,
            isSubscribed,
            messages,
          }),
        })
      );
    } catch (err) {
      next(err);
    }
  },
};
