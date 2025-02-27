import jobPostings from '../../models/jobPostings.js';
import { v4 as uuidv4 } from 'uuid';

const addJob = async (req, res) => {
    const { title, jobType, location, salary, description, requirements, applications,companyName,employerId } = req.body;

    console.log("Received Data on Backend:", req.body);
    const existingJob = await jobPostings.findOne({ title, employerId });
    if (existingJob) {
        return res.status(409).json({ message: "Job with this title already exists for this employer." });
    }
    const job = new jobPostings({
        jobId: uuidv4(),
        title,
        employerId,
        jobType,
        location,
        salary,
        description,
        requirements,
        companyName,
        applications: applications || []  // Default to empty array if not provided
    });

    try {   
        await job.save();
        return res.status(201).json({  success: true,message: "Job Posting Saved successfully",data:job });;
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export { addJob };
