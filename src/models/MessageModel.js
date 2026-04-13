import { DatabaseSingleton } from "../db/DatabaseSingleton.js";

// Same collection name as in seed.js
const COLLECTION = "messages";

// Small helper so we do not repeat getDb() in every function
async function getMessagesCollection() {
  const db = await DatabaseSingleton.getInstance().getDb();
  return db.collection(COLLECTION);
}

/**
 * All functions here only talk to MongoDB.
 * The controller decides when to call them (after checking login, subscription, etc.).
 */
export const MessageModel = {
  /**
   * Save one message. topicId and userId should be the same types you store in Mongo
   * (usually ObjectId from the driver, or values that match existing documents).
   */
  async insert(topicId, userId, body) {
    const col = await getMessagesCollection();
    const doc = {
      topicId,
      userId,
      body,
      createdAt: new Date(),
    };
    const result = await col.insertOne(doc);
    return result.insertedId;
  },

  /**
   * Newest first. Use limit 2 on the home page ("two most recent per topic").
   */
  async listRecentByTopic(topicId, limit = 2) {
    const col = await getMessagesCollection();
    const cursor = col
      .find({ topicId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return cursor.toArray();
  },
};
