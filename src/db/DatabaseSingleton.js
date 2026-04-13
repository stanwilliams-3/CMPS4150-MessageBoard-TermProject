import { MongoClient } from "mongodb";
import "dotenv/config";

/** One MongoClient per process; use getDb() everywhere you need the database. */
export class DatabaseSingleton {
  static instance = null;

  static getInstance() {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  constructor() {
    this.client = null;
    this.db = null;
  }

  async getDb() {
    if (this.db) return this.db;

    const uri = process.env.MONGODB_URI?.trim();
    if (!uri) {
      throw new Error("MONGODB_URI is not set. Copy .env.example to .env.");
    }
    const name = (process.env.DB_NAME || "message_board").trim();

    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db(name);
    return this.db;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}
