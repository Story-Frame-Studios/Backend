import applicationCollection from '../../models/applicationCollection.js';// Assuming you have an Application model
import { invalidateApplicationCache } from '../../utils/cacheUtils.js';

// Delete application by ID
const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // First get the application to know which caches to invalidate
        const application = await applicationCollection.findOne({ applicationId });
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found.',
            });
        }
        
        // Delete the application
        await applicationCollection.deleteOne({ applicationId });

        // Invalidate related caches
        await invalidateApplicationCache({
            applicationId,
            candidateId: application.candidateId,
            jobId: application.jobId
        });

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete application.',
            error: error.message,
        });
    }
};

export default deleteApplication;
