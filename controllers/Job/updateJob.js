import jobPostings from "../../models/jobPostings.js";
import { invalidateCache } from '../../utils/cacheUtils.js';

const updateJob = async (req, res) => {
    try {
        // const { jobId, jobTitle, employmentType, location, salary, description, applicationForm, applicants } = req.body;
        const { jobId,title, jobType, location, salary, description, requirements, applications,companyName } = req.body;
        const updatedJob = await jobPostings.findOneAndUpdate({ jobId: jobId }, {
            title,
            jobType,
            location,
            salary,
            description,
            requirements,
            applications,
            companyName
        }, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Invalidate job cache
        await invalidateCache(`jobs:*`);
        
        // Also invalidate applications for this job
        await invalidateCache(`applications:job:${jobId}`);

        res.status(200).json({  success: true,message: "Job Posting updated successfully",data:updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export { updateJob };