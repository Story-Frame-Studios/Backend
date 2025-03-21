import express from 'express';


const router = express.Router();

import {getJobs} from '../controllers/Job/getJobs.js';
import {addJob} from '../controllers/Job/addJob.js';
import { deleteJob } from '../controllers/Job/deleteJob.js';
import { updateJob } from '../controllers/Job/updateJob.js';
import { getJobsByEmployerId } from '../controllers/Job/getJobsByEmployerId.js';
import getDeletedJobPostings from '../controllers/Job/getDeletedJobPostings.js'
import getJobDetails from '../controllers/Job/getJobDetails.js'

router.get('/all-jobs', getJobs); 
router.post('/post-job', addJob);
router.delete('/delete-job/:id', deleteJob); 
router.put('/update-job', updateJob);
router.get('/getJobsByEmployerId/:id', getJobsByEmployerId);
router.get('/getDeletedJobPostings/:employerId', getDeletedJobPostings);
router.get('/getJobDetails/:jobId',getJobDetails)

export default router;