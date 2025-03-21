import applicationCollection from '../../models/applicationCollection.js';
import deletedApplications from '../../models/deletedApplications.js';
import { invalidateApplicationCache } from '../../utils/cacheUtils.js';

// Soft delete application by moving it to deletedApplications
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

        // Move application to deletedApplications collection
        await deletedApplications.create({
            applicationId: application.applicationId,
            jobId: application.jobId,
            candidateId: application.candidateId,
            resume: application.resume,
            coverLetter: application.coverLetter,
            status: application.status,
            notes: application.notes,
            createdAt: application.createdAt,
            reason:"Deleted By Candidate..!",
            deletedAt: new Date() // Timestamp for when it was deleted
        });

        // Delete from applicationCollection
        await applicationCollection.deleteOne({ applicationId });

        // Invalidate related caches
        await invalidateApplicationCache({
            applicationId,
            candidateId: application.candidateId,
            jobId: application.jobId
        });

        res.status(200).json({
            success: true,
            message: 'Application moved to deleted applications successfully!',
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
