import { DatabaseSingleton } from "../db/DatabaseSingleton.js";


const COLLECTION = "messages";


async function getMessagesCollection() {
  const db = await DatabaseSingleton.getInstance().getDb();
  return db.collection(COLLECTION);
}


export const MessageModel = {
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

  async listRecentByTopic(topicId, limit = 2) {
    const col = await getMessagesCollection();
    const cursor = col
      .find({ topicId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return cursor.toArray();
  },

  async listByTopic(topicId, limit = 100) {
    const col = await getMessagesCollection();
    const cursor = col
      .find({ topicId })
      .sort({ createdAt: 1 })
      .limit(limit);
    return cursor.toArray();
  },
};
