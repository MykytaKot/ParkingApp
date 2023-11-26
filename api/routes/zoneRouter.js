import express from 'express';
import {ObjectId} from 'mongodb';
import {getAllZones,createZone} from '../modules/zoneModule.js';


const router = express.Router();

const createZonehandler = async (req, res) => {
    var height = req.query.height;
    var width = req.query.width;
    var startingID = req.query.startingId;
    
    var matrix = []; // Initialize matrix as an empty array
    console.log(matrix);
    
    for (var i = 0; i < height; i++) {
        matrix[i] = []; // Initialize each row as an empty array
        for (var j = 0; j < width; j++) {
            matrix[i][j] = startingID;
            startingID++;
        }
    }
    
    const data = {
        name: req.query.name, // Corrected spelling of 'query'
        matrix: matrix,
        height: height,
        width: width,
    };
    
    const zoneId = await createZone(data);
    if (zoneId) {
        res.status(200).json({ status: 'success' });
    } else {
        res.status(400).json({ status: 'error' });
    }


};

const getAllZonesHandler = async (req, res) => {
   
    const car = await getAllZones();
    if (car) {
        res.json(car);
    } else {
        res.status(404).send('Zones not found');
    }
};


router.get('/all', getAllZonesHandler);
router.post('/create', createZonehandler);


// Export the router
export default router;
