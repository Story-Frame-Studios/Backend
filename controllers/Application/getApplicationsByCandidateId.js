import applicationCollection from '../../models/applicationCollection.js';
import mongoose from 'mongoose';
import jobPostings from '../../models/jobPostings.js';
const getApplicationsByCandidateId = async (req, res) => {
    const { candidateId } = req.params;  // Extract candidateId from request body

    try {
        console.log(candidateId, "candidateId");

        // Find all applications for the given candidateId
        const applications = await applicationCollection.find({ candidateId });
        console.log(applications, "applications");

        if (applications.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No applications found for this candidate.',
            });
        }

        // Loop through each application to fetch job details based on jobId
        const applicationsWithJobDetails = [];

        for (const application of applications) {
            const { jobId } = application;  // Extract jobId from application

            // Find the corresponding job from the jobPosting collection
            const job = await jobPostings.findOne({ jobId });
            if (job) {
                // Add job details to the application
                applicationsWithJobDetails.push({
                    ...application.toObject(), // Convert application to plain object
                    job, // Add job details
                });
            } else {
                // If no job found, just add the application (without job details)
                applicationsWithJobDetails.push({
                    ...application.toObject(),
                    job: null, // Indicating no job details found
                });
            }
        }

        // Return the merged response with both applications and job details
        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            applications: applicationsWithJobDetails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};


export default getApplicationsByCandidateId;
