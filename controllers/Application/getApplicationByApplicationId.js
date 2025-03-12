import applicationCollection from '../../models/applicationCollection.js';

const getApplicationByApplicationId = async (req, res) => {
    const { applicationId } = req.body;  // Extract jobId from URL parameters

    try {
        // Find all applications for the given jobId
        const application = await applicationCollection.findOne({ applicationId });

        if (application.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No applications found for this job.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            application,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationByApplicationId;
