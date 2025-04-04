import applicationCollection from '../../models/applicationCollection.js';

const getApplicationStatus = async (req, res) => {
    const { jobId, candidateId } = req.params; // Extract jobId and candidateId from URL parameters

    try {
        // Find application based on both jobId and candidateId
        const application = await applicationCollection.findOne({ jobId, candidateId });

        if (!application) {
            return res.status(200).json({
                success: false,
                message: 'No application found for this job and candidate.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application status retrieved successfully!',
            status: application.status, // Return only the status for tracking,
            applicationId:application.applicationId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application status.',
            error: error.message,
        });
    }
};

export default getApplicationStatus;
