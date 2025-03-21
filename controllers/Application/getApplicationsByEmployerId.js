import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';
import users from '../../models/users.js';

const getApplicationsByEmployerId = async (req, res) => {
    const employerId  = req.params.employerId;

    try {
        // Find the employer in the users collection
        const employer = await users.findOne({ userId: employerId, role: "employer" });
        
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: 'Employer not found.',
            });
        }

        // Find all job postings created by the employer
        const jobPostingsByEmployer = await jobPostings.find({ employerId });
        
        if (jobPostingsByEmployer.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No job postings found for this employer.',
            });
        }

        // Find all applications for the jobs created by this employer
        const applications = await applicationCollection.find({
            jobId: { $in: jobPostingsByEmployer.map(job => job.jobId) } // Find applications for jobs posted by this employer
        });
        
        if (applications.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No applications found for this employer.',
            });
        }

        // Loop through each application to fetch job details based on jobId and candidate first name
        const applicationsWithJobDetailsAndCandidateName = [];

        for (const application of applications) {
            const { jobId, candidateId } = application;  // Extract jobId and candidateId from application

            // Find the corresponding job from the jobPosting collection
            const job = await jobPostings.findOne({ jobId });
            
            // Find the candidate details from the users collection using candidateId
            const candidate = await users.findOne({ userId: candidateId });

            // Prepare the application with job details and candidate's first name
            applicationsWithJobDetailsAndCandidateName.push({
                ...application.toObject(), // Convert application to plain object
                job, // Add job details
                candidateFirstName: candidate ? candidate.firstName : "N/A", // Add candidate's first name
            });
        }

        // Return the merged response with both applications, job details, and candidate first name
        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            applications: applicationsWithJobDetailsAndCandidateName,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationsByEmployerId;
