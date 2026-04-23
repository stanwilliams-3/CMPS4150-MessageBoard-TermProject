import mongoose from "mongoose";
import User from "../models/User.js";
import { layoutPage } from "../html/layout.js";
import {
  usersIndexMainHtml,
  usersListRowsHtml,
  userProfileMainHtml,
} from "../html/pageTemplates.js";

function sessionUser(req) {
  const id = req.session?.userId;
  const username = req.session?.username;
  if (!id || !username) return null;
  return { userId: String(id), username };
}

export const userController = {
  async list(req, res, next) {
    try {
      const rows = await User.find()
        .select("username")
        .sort({ username: 1 })
        .lean()
        .limit(200);

      const users = rows.map((row) => ({
        userId: String(row._id),
        username: row.username,
      }));

      res.type("html").send(
        layoutPage({
          title: "Members",
          user: sessionUser(req),
          mainHtml: usersIndexMainHtml() + usersListRowsHtml(users),
        })
      );
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const self = sessionUser(req);
      if (!self) {
        return res.redirect("/auth/login");
      }

      res.type("html").send(
        layoutPage({
          title: "Your profile",
          user: self,
          mainHtml: userProfileMainHtml({
            profile: { userId: self.userId, username: self.username },
            isSelf: true,
          }),
        })
      );
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const raw = req.params.userId;
      let id;
      try {
        id = new mongoose.Types.ObjectId(String(raw));
      } catch {
        return res.status(404).send("User not found.");
      }

      const doc = await User.findById(id).select("username").lean();
      if (!doc) {
        return res.status(404).send("User not found.");
      }

      const self = sessionUser(req);
      const profile = { userId: String(doc._id), username: doc.username };
      const isSelf = Boolean(self && self.userId === profile.userId);

      res.type("html").send(
        layoutPage({
          title: profile.username,
          user: self,
          mainHtml: userProfileMainHtml({ profile, isSelf }),
        })
      );
    } catch (err) {
      next(err);
    }
  },
};
