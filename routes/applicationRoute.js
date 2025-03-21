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
import getApplicationsByEmployerId from '../controllers/Application/getApplicationsByEmployerId.js';
import getApplicantsForEmployer from '../controllers/Application/getApplicantsForEmployer.js';
import getAppliedApplicationsByCandidate from '../controllers/Application/getAppliedApplicationsByCandidate.js';
import getDeletedApplications from '../controllers/Application/getDeletedApplications.js'
import getDeletedApplicationsForEmployer from '../controllers/Application/getDeletedApplicationsForEmployer.js';
import getApplicationDetailForEmployer from '../controllers/Application/getApplicationDetailForEmployer.js'
import changeApplicationStatus from '../controllers/Application/changeApplicationStatus.js'

router.post('/addApplication', addApplication);
router.post('/getApplicationsByJobId', getApplicationsByJobId);
router.get('/getApplicationsByCandidateId/:candidateId', getApplicationsByCandidateId);
router.get('/getApplicationByApplicationId/:applicationId', getApplicationByApplicationId);
router.post('/getApplicationStatus', getApplicationStatus);
router.delete('/deleteApplication/:applicationId', deleteApplication); 
router.put('/updateApplicationStatus', verifyUser, verifyRole('employer'),updateApplicationStatus);
router.get('/getApplicationsByEmployerId/:employerId', getApplicationsByEmployerId);
router.get('/getApplicantsForEmployer/:employerId', getApplicantsForEmployer);
router.get('/getAppliedApplicationsByCandidate/:employerId/:candidateId', getAppliedApplicationsByCandidate);
router.get('/getDeletedApplications/:candidateId', getDeletedApplications);
router.get('/getDeletedApplicationsForEmployer/:employerId', getDeletedApplicationsForEmployer);
router.get('/getApplicationDetailForEmployer/:employerId/:applicationId', getApplicationDetailForEmployer);
router.post('/changeApplicationStatus/:employerId/:applicationId', changeApplicationStatus);


getDeletedApplicationsForEmployer
export default router;