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

const app = express();
registerAppObservers();

console.log("MONGO_URI =", process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
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
