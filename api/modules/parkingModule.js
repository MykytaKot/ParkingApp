import {ObjectId} from 'mongodb';
import {connectToDatabase} from './db.js';

export const getParkingById = async (parkingId) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    const id = ObjectId.isValid(parkingId) ? new ObjectId(parkingId) : null;
    return cars.findOne({ _id: id });
};
export const getParkingByCarId = async (parkingId) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    
    return cars.findOne({ car_id: new ObjectId(parkingId) });
};

export const getReservationsByPlace = async (place) => {
    const db = await connectToDatabase();
    const reservations = db.collection('parking');
    return await reservations.find({ place:place }).toArray();
};


export const getAllparking = async (place) => {
    const db = await connectToDatabase();
    const reservations = db.collection('parking');
    return await reservations.find().toArray();
};

export const getReservationStatus = async (place, currentTime) => {
    const db = await connectToDatabase();
    const reservations = db.collection('parking');
    console.log(currentTime);
    const currentReservations = await reservations.find({ place:place }).toArray();
    for (let i = 0; i < currentReservations.length; i++) {
        const reservation = currentReservations[i];
       
        if(reservation.from_time < currentTime && reservation.to_time > currentTime){
            if (!reservation.car_on_place) {
                return 2; // Occupied
            } else {
                return 3; // Waiting
            }
        } 
            
        
    }
    return 1
};




export const createParking = async (parkingData) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    const result = await cars.insertOne(parkingData);
    if (result.acknowledged) {
        return result.insertedId;
    } else {
        return false;
    }
};

export const editParking = async (id,parkingData) => {

    const db = await connectToDatabase();
    const cars = db.collection('parking');
    const result = await cars.updateOne({ _id: new ObjectId(id) }, { $set: { from_time: parkingData.from_time, to_time: parkingData.to_time , car_id:parkingData.car_id } });
    if (result.acknowledged) {
        return result.insertedId;
    } else {
        return false;
    }
}


export const carArrived = async (id) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    
    const result = await cars.updateOne({ _id: new ObjectId(id) }, { $set: { car_on_place: true } });
    
    if (result.modifiedCount === 1) {
        return { message: 'Car arrived successfully' };
    } else {
        throw new Error('Car not found');
    }
};
export const notificationArrived = async (id) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    
    const result = await cars.updateOne({ _id: new ObjectId(id) }, { $set: { notified: true } });
    
    if (result.modifiedCount === 1) {
        return { message: 'Car arrived successfully' };
    } else {
        throw new Error('Car not found');
    }
};

export const expiredArrived = async (id) => {
    const db = await connectToDatabase();
    const cars = db.collection('parking');
    
    const result = await cars.updateOne({ _id: new ObjectId(id) }, { $set: { expired: true } });
    
    if (result.modifiedCount === 1) {
        return { message: 'Car arrived successfully' };
    } else {
        throw new Error('Car not found');
    }
};


export const deleteParkingById = async (parkingID) => {
    const db = await connectToDatabase();
    const users = db.collection('parking');

    // Ensure the userId is valid, if not, return a message or null
    if (!ObjectId.isValid(parkingID)) {
        throw new Error('Invalid parking ID format');
    }

    const result = await users.deleteOne({ _id: new ObjectId(parkingID) });

    // The result object contains a property 'deletedCount' which is 1 if a document was deleted
    if (result.deletedCount === 1) {
        return { message: 'parking successfully deleted' };
    } else {
        throw new Error('parking not found');
    }
};