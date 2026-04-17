import { DatabaseSingleton } from "../db/DatabaseSingleton.js";

const COLLECTION = "subscriptions";

async function getSubscriptionsCollection() {
    const db = await DatabaseSingleton.getInstance().getDb();
    return db.collection(COLLECTION);
}

export const SubscriptionModel = {
    async subscribe(userId, topicId) {
        const col = await getSubscriptionsCollection();
        await col.insertOne({ 
            userId, 
            topicId, 
            subscribedAt: new Date() 
        });
    },


    async isSubscribed(userId, topicId) {
        const col = await getSubscriptionsCollection();
        const result = await col.findOne({ userId, topicId });
        return result !== null;
    },

    async unsubscribe(userId, topicId) {
        const col = await getSubscriptionsCollection();
        await col.deleteOne({ userId, topicId });
    },
};