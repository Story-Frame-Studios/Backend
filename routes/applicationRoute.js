import express from 'express';

const router = express.Router();

import addApplication from '../controllers/Application/addApplication.js';
import getApplicationsByJobId from '../controllers/Application/getApplicationsByJobId.js';
import getApplicationsByCandidateId from '../controllers/Application/getApplicationsByCandidateId.js';
import getApplicationByApplicationId from '../controllers/Application/getApplicationByApplicationId.js';
import getApplicationStatus from '../controllers/Application/getApplicationStatus.js';

router.post('/addApplication', addApplication);
router.get('/getApplicationsByJobId', getApplicationsByJobId);
router.get('/getApplicationsByCandidateId', getApplicationsByCandidateId);
router.get('/getApplicationByApplicationId', getApplicationByApplicationId);
router.get('/getApplicationStatus', getApplicationStatus);



export default router;