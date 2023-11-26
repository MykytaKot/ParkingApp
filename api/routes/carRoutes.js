import express from 'express';
import {ObjectId} from 'mongodb';
import {getCarById, getCarByUserId,getCarByNumber, checkCarByCarID, createCar, deleteCarById} from '../modules/carsModule.js';

const router = express.Router();

// Handler to get a user by ID
const getCarByIdHandler = async (req, res) => {
    try {
        const carId = new ObjectId(req.params.id);
        const car = await getCarById(carId);
        // If a user is found, return it in the response
        if (car) {
            res.json(car);
        } else {
            // If no user is found, return a 404 (Not Found) status code
            res.status(404).send('Car not found');
        }
    } catch (error) {
        // If there's an error (e.g., invalid ObjectId format), return a 500 (Internal Server Error) status code
        res.status(500).send('Error retrieving car: ' + error.message);
    }
};

const getCarByUserIdHandler = async (req, res) => {
    try {
        const carId = new ObjectId(req.params.id);
        const car = await getCarByUserId(carId);
        // If a user is found, return it in the response
        if (car) {
            res.json(car);
        } else {
            // If no user is found, return a 404 (Not Found) status code
            res.status(404).send('Car not found');
        }
    } catch (error) {
        // If there's an error (e.g., invalid ObjectId format), return a 500 (Internal Server Error) status code
        res.status(500).send('Error retrieving car: ' + error.message);
    }
};

// Handler to get a user by Email
const getCarByNumberHandler = async (req, res) => {
    try {
        const number = req.params.number;
        const car = await getCarByNumber(number);
        if (car) {
            res.json(car);
        } else {
            res.status(404).send('Car not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handler to check if a user exists and return the user if they exist
const checkCarExistHandler = async (req, res) => {
    try {
        const identifier = req.query.number; 
        const car = await checkCarByCarID(identifier);
        if (car) {
            res.json(car);
        } else {
            res.status(404).send('Car does not exist');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createCarHandler = async (req, res) => {
    try {
         
        const currentTimestamp = Date.now();
        if(await getCarByNumber(req.query.car_number)){

            res.status(400).json({ status: 'error' , message : 'Car with this number already in database , user was not created' });
            return;
        }
        if(req.query.userId && req.query.car_number && req.query.car_name){
            var carData = {
                user_id: new ObjectId(req.query.userId),
                number: req.query.car_number,
                name: req.query.car_name,
                created_at: currentTimestamp
            };
            const carId = await createCar(carData);
            res.status(201).json({ _id: carId, ...carData });
        }else{
            res.status(400).send('Not enought data for car');
        }
        
    } catch (error) {
        res.status(500).send('Error creating car: ' + error.message);
    }
};

const deleteCarHandler = async (req, res) => {
    try {
        const carId = new ObjectId(req.params.id);
        const result = await deleteCarById(carId);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error deleting car: ' + error.message);
    }
};

// Define routes
router.get('/:id', getCarByIdHandler);
router.get('/user/:id', getCarByUserIdHandler);
router.get('/number/:numbe', getCarByNumberHandler);
router.post('/check-existence', checkCarExistHandler);
router.post('/create', createCarHandler);
router.delete('/delete/:id', deleteCarHandler);


// Export the router
export default router;
