import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_DB);
const dbName = 'parkdb';

export const connectToDatabase = async () => {
    await client.connect();
    console.log('Connected to database');
    return client.db(dbName);
};
