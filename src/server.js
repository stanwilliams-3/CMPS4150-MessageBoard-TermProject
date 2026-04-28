import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { homeController } from "./controllers/homeController.js";
import subscriptionsRoutes from "./routes/subscriptions.routes.js";
import topicsRoutes from "./routes/topics.routes.js";
import usersRoutes from "./routes/users.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import { registerAppObservers } from "./observers/registerAppObservers.js";

const MONGO_URI = process.env.MONGO_URI?.trim();

const app = express();
registerAppObservers();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  if (!MONGO_URI) {
    console.error("Set MONGO_URI in .env (see .env.example if present).");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (err.code === "ECONNREFUSED" && err.syscall === "querySrv") {
      console.error(
        "DNS SRV lookup for mongodb+srv was refused. Try: different network/VPN off, set DNS to 8.8.8.8 or 1.1.1.1, or use Atlas’s standard `mongodb://` connection string instead of `mongodb+srv://`."
      );
    }
    process.exit(1);
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret123",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI
      }),
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  );

  app.use("/auth", authRoutes);
  app.use("/subscriptions", subscriptionsRoutes);
  app.use("/topics", topicsRoutes);
  app.use("/users", usersRoutes);
  app.use("/messages", messagesRoutes);

  app.get("/", homeController.showHome);
  app.get("/home", homeController.showHome);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
