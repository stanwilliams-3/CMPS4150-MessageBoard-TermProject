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
            subscribers: [],
        };

        const result = await col.insertOne(doc);
        return result.insertedId;
    },
};

    
    