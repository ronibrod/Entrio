import { MongoClient } from 'mongodb';

let db = null;

export async function connectToMongoDB(app) {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);

    db = client.db();
    app.locals.db = db;

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}
