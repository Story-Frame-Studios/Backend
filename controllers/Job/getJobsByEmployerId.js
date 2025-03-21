//this api is used to get all the jobs posted by a particular employer using employerId(UserId of Employer) 
import jobPostings from '../../models/jobPostings.js';

const getJobsByEmployerId = async (req, res) => {
    const employerId = req.params.id;  // Extract employerId from request body
    
    try {
        // Find all jobs posted by the employer
        const jobs = await jobPostings.find({ employerId });
        
        if (jobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No jobs found for this employer.',
            });
        }

        // Return the jobs posted by the employer
        res.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully!',
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs.',
            error: error.message,
        });
    }
};

export {getJobsByEmployerId};
