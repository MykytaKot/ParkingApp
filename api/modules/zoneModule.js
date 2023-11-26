import {ObjectId} from 'mongodb';
import {connectToDatabase} from './db.js';

export const getAllZones = async () => {
    const db = await connectToDatabase();
    const zones = db.collection('zones');
    return await zones.find().toArray();
};

export const createZone = async (data) => {
    const db = await connectToDatabase();
    const zones = db.collection('zones');
    return await zones.insertOne(data);
};
