import { MongoClient } from 'mongodb';
import 'dotenv/config';

const URI = process.env.MONGO_URI;

const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    dbConnection = client.db();
  } catch (error) {
    console.log('Failed to connect to MongoDB: ', error);
    throw err;
  }
}

function getDB() {
  if (!dbConnection) {
    throw new Error('Database not connection');
  }
  return dbConnection;
}

export { connectToDatabase, getDB };
