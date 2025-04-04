import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';
import users from '../../models/users.js'; // Import the users model to fetch candidate details
import { sendEmail } from '../../service/emailService.js'; // Import the email service

const changeApplicationStatus = async (req, res) => {
    const { employerId, applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['received', 'under review', 'interview', 'hired', 'rejected', 'withdrawn'];

    try {
        // Validate the status
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

        // Check if the employer is authorized to update the application
        if (job.employerId !== employerId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You do not have permission to update this application.'
            });
        }

        // Fetch candidate details
        const candidate = await users.findOne({ userId: application.candidateId });
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found.'
            });
        }

        // Update the application status
        const updatedApplication = await applicationCollection.findOneAndUpdate(
            { applicationId },
            { $set: { status: status.toLowerCase() } },
            { new: true }
        );

        // Send email to the candidate
        sendEmail(
            candidate.email,
            `Application Status Updated - Story Frame Studio`,
            `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${candidate.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  The status of your application for the job <strong>${job.title}</strong> has been updated to <strong>${status.toLowerCase()}</strong>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need further information, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
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