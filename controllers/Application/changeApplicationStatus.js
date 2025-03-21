import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';

const changeApplicationStatus = async (req, res) => {
    const { employerId, applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['received', 'under review', 'interview', 'hired', 'rejected', 'withdrawn'];

    try {
        if (!status || !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed values: received, under review, interview, hired, rejected, withdrawn.'
            });
        }

        // Find the application
        const application = await applicationCollection.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found.'
            });
        }

        // Retrieve employerId from the job posting
        const job = await jobPostings.findOne({ jobId: application.jobId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Associated job posting not found.'
            });
        }

        if (job.employerId !== employerId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You do not have permission to update this application.'
            });
        }

        // Update the application status
        const updatedApplication = await applicationCollection.findOneAndUpdate(
            { applicationId },
            { $set: { status: status.toLowerCase() } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully.',
            application: updatedApplication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update application status.',
            error: error.message
        });
    }
};

export default changeApplicationStatus;
