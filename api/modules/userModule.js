import {ObjectId} from 'mongodb';
import {connectToDatabase} from './db.js';

export const getUserById = async (userId) => {
    const db = await connectToDatabase();
    const users = db.collection('users');
    const id = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    return users.findOne({ _id: id });
};

export const getUserByEmail = async (email) => {
    const db = await connectToDatabase();
    const users = db.collection('users');
    return users.findOne({ email: email }); // Directly use the email parameter in the query
};


export const checkUserExist = async (identifier) => {
    const db = await connectToDatabase();
    const users = db.collection('users');
    const query = {};
    if (identifier.id) query.id = identifier.id;
    if (identifier.email) query.email = identifier.email;

    return await users.findOne(query);
};

export const createUser = async (userData) => {
    const db = await connectToDatabase();
    const users = db.collection('users');
    const result = await users.insertOne(userData);
    if (result.acknowledged) {
        return result.insertedId;
    } else {
        return false;
    }
};

export const setBantime= async (id ,time) => {
    const db = await connectToDatabase();
    const users = db.collection('users');
    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { ban_end_time: time } });
    if (result.acknowledged) {
        return result.insertedId;
    } else {
        return false;
    }
}

export const setSocialScore = async (id , score) => {
   
    const db = await connectToDatabase();
    const users = db.collection('users');
    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { social_score: score } });
    if (result.acknowledged) {
        return result.insertedId;
    } else {
        return false;
    }
};

export const deleteUserById = async (userId) => {
    const db = await connectToDatabase();
    const users = db.collection('users');

    // Ensure the userId is valid, if not, return a message or null
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
    }

    const result = await users.deleteOne({ _id: new ObjectId(userId) });

    // The result object contains a property 'deletedCount' which is 1 if a document was deleted
    if (result.deletedCount === 1) {
        return { message: 'User successfully deleted' };
    } else {
        throw new Error('User not found');
    }
};