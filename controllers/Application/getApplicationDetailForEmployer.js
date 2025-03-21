import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';

const getApplicationDetailForEmployer = async (req, res) => {
    const { employerId, applicationId } = req.params; // Extract parameters from URL

    try {
        // Find the application by applicationId
        const application = await applicationCollection.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'No application found for this applicationId.',
            });
        }

        // Find the job posting and ensure it belongs to the employer
        const job = await jobPostings.findOne(
            { jobId: application.jobId, employerId },
            'title companyName salary location jobType' // Select only required fields
        );

        if (!job) {
            return res.status(403).json({
                success: false,
                message: 'No job found for this employer or unauthorized access.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application and Job details retrieved successfully!',
            application,
            job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application and job details.',
            error: error.message,
        });
    }
};

export default getApplicationDetailForEmployer;