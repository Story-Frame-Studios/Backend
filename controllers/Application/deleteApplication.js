import applicationCollection from '../../models/applicationCollection.js';
import deletedApplications from '../../models/deletedApplications.js'; 

// Soft delete application by moving it to deletedApplications
const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find the application to delete
        const application = await applicationCollection.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

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

        res.status(200).json({ message: 'Application moved to deleted applications successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default deleteApplication;
