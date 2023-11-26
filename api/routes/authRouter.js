import express from 'express';
import { getUserById, getUserByEmail, checkUserExist,createUser, deleteUserById } from '../modules/userModule.js';
import { createCar ,getCarByNumber } from '../modules/carsModule.js';
import {registrationConfirm} from '../modules/emailer.js';
const ending = 'tsystems.sk';
const router = express.Router();

const RegistrationHandler = async (req, res) => {
    var name = req.query.name ;
    var surname = req.query.surname;
    var email = req.query.email;
    var car_number = req.query.car_number;
    var car_name = req.query.car_name;
    var corporate_card = req.query.corporate_card;
    var phone = req.query.corporate_card;
    
    

    if (name && surname && email && car_number && car_name && phone && corporate_card) {
        // All variables exist and are not null
        const emailValid = endsWith(email, ending);
        if(await getUserByEmail(email)){
            res.status(400).json({ status: 'error' , message : 'Email already exists' });
            return;
        }
        if (emailValid) {
            var password = generateRandomPassword();
            const currentTimestamp = Date.now();
            var data = {
                name: name,
                surname: surname,
                is_admin: false,
                social_score: 3,
                email: email,
                phone:phone,
                corporate_card: corporate_card,
                password: password,
                created_at: currentTimestamp,
                ban_end_time: currentTimestamp

            };

            var userId = await createUser(data);
            if(userId){
                var carData = {
                    user_id: userId,
                    number: car_number,
                    name: car_name,
                    created_at: currentTimestamp
                }
                if(await getCarByNumber(car_number)){
                    res.status(400).json({ status: 'error' , message : 'Car with this number already in database , user was not created' });
                    await deleteUserById(userId);
                    return;
                }

                var carId = await createCar(carData);
                if(carId){
                    await registrationConfirm(email,password);
                    res.status(200).json({ data: req.query, status: 'success' });
                }else{
                    res.status(400).json({ status: 'error' , message : 'Dataabse error' });
                    await deleteUserById(userId);
                }
               
            }else{
                res.status(400).json({ status: 'error' , message : 'Dataabse error' });
            }
            
        } else {
            res.status(400).json({ status: 'error' , message : 'Invalid email host must be tsystems.sk' });
        }
    } else {
        res.status(400).json({ status: 'error', message : 'On of the fields are empty' });
    }
};
const generateRandomPassword = () => {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
};



const LoginHandler = async (req, res) => {
    var email = req.query.email;
    var password = req.query.password;
    if (email && password) {
        // All variables exist and are not null
        const emailValid = endsWith(email, ending);
        if (emailValid) {

            var user = await getUserByEmail(email);
            
            if(user){
                if(user.password == password){
                    res.status(200).json({ data: user, status: 'success' });
                }else{
                    res.status(400).json({ status: 'error' , message: 'wrong password' });
                    
                }
                
            }else{
                res.status(400).json({ status: 'error' , message: 'user not found' });
            }
            
        } else {
            res.status(400).json({ status: 'error' , message: 'wrong email host' });
        }
    } else {
        res.status(400).json({ status: 'error' });
    }
}

const RegistrationEmailCheckHandler = async (req, res) => {
    const email = req.query.email;
    if(email != null){
        if (endsWith(email, ending)) {
            res.status(200).json({ valid: 1 });
        } else {
            res.status(200).json({ valid: 0 });
        }
    }else{
        res.status(200).json({ valid: 0 });
    }
    
};

function endsWith(email, host) {
    // Get the domain from the email
    var domain = email.split('@')[1];

    // Check if the domain matches the host
    if (domain === host) {
        return true;
    } else {
        return false;
    }
}

router.post('/login', LoginHandler);
router.get('/registration/emailCheck', RegistrationEmailCheckHandler);
router.post('/registration/add', RegistrationHandler);

// Export the router
export default router;
