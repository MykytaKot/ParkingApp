import express from 'express';
import {getUserById, getUserByEmail, checkUserExist, createUser,setBantime, deleteUserById,setSocialScore} from '../modules/userModule.js';

const router = express.Router();

// Handler to get a user by ID
const getUserByIdHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);
        // If a user is found, return it in the response
        if (user) {
            res.json(user);
        } else {
            // If no user is found, return a 404 (Not Found) status code
            res.status(404).send('User not found');
        }
    } catch (error) {
        // If there's an error (e.g., invalid ObjectId format), return a 500 (Internal Server Error) status code
        res.status(500).send('Error retrieving user: ' + error.message);
    }
};

// Handler to get a user by Email
const getUserByEmailHandler = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await getUserByEmail(email);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handler to check if a user exists and return the user if they exist
const checkUserExistHandler = async (req, res) => {
    try {
        const identifier = req.body; // Assuming you pass either { _id: userId } or { email: userEmail }
        const user = await checkUserExist(identifier);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User does not exist');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createUserHandler = async (req, res) => {
    try {
        const userData = req.body;
        const userId = await createUser(userData);
        res.status(201).json({ _id: userId, ...userData });
    } catch (error) {
        res.status(500).send('Error creating user: ' + error.message);
    }
};
const SetSocialScoreHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const score = req.query.score;
        const userId = await setSocialScore(id, score);
        res.status(201).json({ status:"sucsess" });
    } catch (error) {
        res.status(500).send('Error creating user: ' + error.message);
    }
};

const deleteUserHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await deleteUserById(userId);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
};

const AddBanTime = async (req, res) => {
    try {
        const userId = req.params.id;
        var time =  Date.now();
        var set = await setBantime(userId,time+1036800000);
       
        res.status(200).json({ status: 'success' });
       
       
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
};

const IsUserBanned = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await getUserById(userId);
        var time =  Date.now();
        if(result.ban_end_time < time){
            res.status(200).json({ status: 'success' ,isBanned: false });
        }else{
            res.status(200).json({ status: 'success' ,isBanned: true });
        }
       
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
};

// Define routes
router.get('/:id', getUserByIdHandler);
router.get('/email/:email', getUserByEmailHandler);
router.post('/check-existence', checkUserExistHandler);
router.get('/check-ban/:id', IsUserBanned);
router.post('/create', createUserHandler);
router.post('/admin/ban/:id', AddBanTime);
router.post('/score/:id', SetSocialScoreHandler);
router.delete('delete/:id', deleteUserHandler);


// Export the router
export default router;
