import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from "../../models/jobPostings.js";

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;
        const userId = req.user._id; // Ensure user ID is extracted correctly from the authenticated user

        // Find application by applicationId (not _id)
        const application = await applicationCollection.findOne({ applicationId });
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // Find job associated with this application
        const job = await jobPostings.findOne({jobId:application.jobId});
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Ensure the logged-in employer owns the job
        if (job.employerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only update applications for your own jobs.' });
        }

        // Update status
        application.status = status;
        await application.save();

        res.status(200).json({ message: 'Application status updated successfully.', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

export default updateApplicationStatus;
