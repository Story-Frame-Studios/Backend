import express from 'express';

const router = express.Router();

import addApplication from '../controllers/Application/addApplication.js';
import getApplicationsByJobId from '../controllers/Application/getApplicationsByJobId.js';
import getApplicationsByCandidateId from '../controllers/Application/getApplicationsByCandidateId.js';
import getApplicationByApplicationId from '../controllers/Application/getApplicationByApplicationId.js';
import getApplicationStatus from '../controllers/Application/getApplicationStatus.js';
import deleteApplication from '../controllers/Application/deleteApplication.js';
import updateApplicationStatus from '../controllers/Application/updateApplicationStatus.js';
import verifyRole from '../middleware/verifyRole.js'; 
import verifyUser from '../middleware/verifyUser.js'; 

router.post('/addApplication', addApplication);
router.post('/getApplicationsByJobId', getApplicationsByJobId);
router.post('/getApplicationsByCandidateId', getApplicationsByCandidateId);
router.get('/getApplicationByApplicationId/:applicationId', getApplicationByApplicationId);
router.post('/getApplicationStatus', getApplicationStatus);
router.delete('/deleteApplication/:applicationId', deleteApplication); 
router.put('/updateApplicationStatus', verifyUser, verifyRole('employer'),updateApplicationStatus);

export default router;