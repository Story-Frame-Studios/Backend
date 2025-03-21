import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js'; // Assuming you have a job collection model

const getApplicationByApplicationId = async (req, res) => {
    const { applicationId } = req.params;  // Extract applicationId from URL parameters

    try {
        // Find the application by applicationId
        const application = await applicationCollection.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'No application found for this applicationId.',
            });
        }

        // Fetch job details using jobId from the application
        const job = await jobPostings.findOne(
            { jobId: application.jobId },
            'title companyName salary location jobType'  // Only select the fields you need
          );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job details not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application and Job details retrieved successfully!',
            application,
            job,  // Include job details in the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application and job details.',
            error: error.message,
        });
    }
};

export default getApplicationByApplicationId;
