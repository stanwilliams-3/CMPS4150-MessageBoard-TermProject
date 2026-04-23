import { DatabaseSingleton } from "../db/DatabaseSingleton.js";

const COLLECTION = "topics";

async function getTopicsCollection() {
  const db = await DatabaseSingleton.getInstance().getDb();
  return db.collection(COLLECTION);
}

export const TopicModel = {
    async insert(title, createdBy) {
        const col = await getTopicsCollection();
        const doc = { 
            title,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
            accessCount: 0,
        };

        const result = await col.insertOne(doc);
        return result.insertedId;
    },

    async findById(topicId) {
        const col = await getTopicsCollection();
        return col.findOne({ _id: topicId });
    },

    async listAll() {
        const col = await getTopicsCollection();
        return col.find({}).sort({ title: 1 }).toArray();
    },

    async incrementAccess(topicId) {
        const col = await getTopicsCollection();
        await col.updateOne(
            { _id: topicId },
            { $inc: { accessCount: 1 }, $set: { updatedAt: new Date() } }
        );
    },
};

    
    