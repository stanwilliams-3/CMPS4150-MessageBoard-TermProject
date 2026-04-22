import { DriverObjectId } from "../db/driverObjectId.js";
import { SubscriptionModel } from "../models/SubscriptionModel.js";
import { TopicModel } from "../models/TopicModel.js";
import { layoutPage } from "../html/layout.js";
import { homeMainHtml } from "../html/pageTemplates.js";

export const homeController = {
  async showHome(req, res, next) {
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

      const topicIds = await SubscriptionModel.listTopicIdsForUser(userId);
      const rows = [];

      for (const topicId of topicIds) {
        const topic = await TopicModel.findById(topicId);
        if (!topic) {
          continue;
        }
        rows.push({
          topicId: String(topicId),
          topicTitle: topic.title,
          accessCount: Number(topic.accessCount || 0),
          updatedAt: topic.updatedAt ?? topic.createdAt ?? null,
        });
      }

      const recentTopics = rows
        .sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 2);

      const flash =
        typeof req.query?.flash === "string" && req.query.flash.trim()
          ? req.query.flash.trim()
          : undefined;

      res.type("html").send(
        layoutPage({
          title: "Home",
          user: req.session.username
            ? { username: req.session.username }
            : null,
          mainHtml: homeMainHtml({ flash, recentTopics }),
        })
      );
    } catch (err) {
      next(err);
    }
  },
};
