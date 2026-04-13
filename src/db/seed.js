import { ObjectId } from "mongodb";
import { DatabaseSingleton } from "./DatabaseSingleton.js";

const dbSingleton = DatabaseSingleton.getInstance();

async function seed() {
  const db = await dbSingleton.getDb();

  const users = db.collection("users");
  const topics = db.collection("topics");
  const subscriptions = db.collection("subscriptions");
  const messages = db.collection("messages");

  if ((await users.countDocuments()) > 0) {
    console.log("Database already has users; skipping seed (delete collections to re-seed).");
    await dbSingleton.disconnect();
    return;
  }

  const now = () => new Date();

  const userDocs = [
    {
      _id: new ObjectId(),
      username: "alice",
      email: "alice@example.com",
      passwordHash: "$2b$10$PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION",
      createdAt: now(),
    },
    {
      _id: new ObjectId(),
      username: "bob",
      email: "bob@example.com",
      passwordHash: "$2b$10$PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION",
      createdAt: now(),
    },
    {
      _id: new ObjectId(),
      username: "carol",
      email: "carol@example.com",
      passwordHash: "$2b$10$PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION",
      createdAt: now(),
    },
  ];

  const topicDocs = [
    {
      _id: new ObjectId(),
      title: "General",
      createdBy: userDocs[0]._id,
      createdAt: now(),
    },
    {
      _id: new ObjectId(),
      title: "Project ideas",
      createdBy: userDocs[1]._id,
      createdAt: now(),
    },
    {
      _id: new ObjectId(),
      title: "Help & support",
      createdBy: userDocs[2]._id,
      createdAt: now(),
    },
  ];

  const subscriptionDocs = [
    { userId: userDocs[0]._id, topicId: topicDocs[0]._id, subscribedAt: now() },
    { userId: userDocs[0]._id, topicId: topicDocs[1]._id, subscribedAt: now() },
    { userId: userDocs[1]._id, topicId: topicDocs[0]._id, subscribedAt: now() },
    { userId: userDocs[1]._id, topicId: topicDocs[1]._id, subscribedAt: now() },
    { userId: userDocs[2]._id, topicId: topicDocs[2]._id, subscribedAt: now() },
  ];

  const messageDocs = [
    {
      topicId: topicDocs[0]._id,
      userId: userDocs[0]._id,
      body: "Welcome to General — say hi!",
      createdAt: now(),
    },
    {
      topicId: topicDocs[0]._id,
      userId: userDocs[1]._id,
      body: "Hi everyone, glad to be here.",
      createdAt: now(),
    },
    {
      topicId: topicDocs[0]._id,
      userId: userDocs[0]._id,
      body: "Feel free to start side threads in other topics.",
      createdAt: now(),
    },
    {
      topicId: topicDocs[1]._id,
      userId: userDocs[1]._id,
      body: "Idea: a small message board with MVC + Observer.",
      createdAt: now(),
    },
    {
      topicId: topicDocs[1]._id,
      userId: userDocs[0]._id,
      body: "Love it — we could use MongoDB on Render.",
      createdAt: now(),
    },
    {
      topicId: topicDocs[2]._id,
      userId: userDocs[2]._id,
      body: "Post questions here; the community can help.",
      createdAt: now(),
    },
  ];

  await users.insertMany(userDocs);
  await topics.insertMany(topicDocs);
  await subscriptions.insertMany(subscriptionDocs);
  await messages.insertMany(messageDocs);

  await subscriptions.createIndex({ userId: 1, topicId: 1 }, { unique: true });
  await messages.createIndex({ topicId: 1, createdAt: -1 });
  await topics.createIndex({ title: 1 });

  console.log("Seed complete.");
  console.log(`  users: ${userDocs.length}, topics: ${topicDocs.length}, subscriptions: ${subscriptionDocs.length}, messages: ${messageDocs.length}`);
  await dbSingleton.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
