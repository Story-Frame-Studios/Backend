import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';
import users from '../../models/users.js'; // Import users model

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

        // Find the candidate's user details using userId from the application
        const candidateUser = await users.findOne({ userId: application.candidateId });

        if (!candidateUser) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found in the users database.',
            });
        }

        // Include candidate details in the response
        const candidate = {
            firstName: candidateUser.firstName,
            lastName: candidateUser.lastName,
            email: candidateUser.email,
        };

        res.status(200).json({
            success: true,
            message: 'Application and Job details retrieved successfully!',
            application,
            job,
            candidate,  // Send candidate details as part of the response
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
