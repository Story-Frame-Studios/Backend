import applicationCollection from '../../models/applicationCollection.js';
import deletedApplications from '../../models/deletedApplications.js';
import { invalidateApplicationCache } from '../../utils/cacheUtils.js';
import users from '../../models/users.js'; // Import the users model to fetch candidate and employer details
import jobPostings from '../../models/jobPostings.js'; // Import the jobPostings model to fetch job details
import { sendEmail } from '../../service/emailService.js'; // Import the email service

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

        // Fetch candidate details
        const candidate = await users.findOne({ userId: application.candidateId });
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found.',
            });
        }

        // Fetch job details to get the employerId
        const job = await jobPostings.findOne({ jobId: application.jobId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Associated job posting not found.',
            });
        }

        // Fetch employer details
        const employer = await users.findOne({ userId: job.employerId });
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: 'Employer not found.',
            });
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
            reason: "Deleted By Candidate..!",
            deletedAt: new Date(), // Timestamp for when it was deleted
        });

        // Delete from applicationCollection
        await applicationCollection.deleteOne({ applicationId });

        // Invalidate related caches
        await invalidateApplicationCache({
            applicationId,
            candidateId: application.candidateId,
            jobId: application.jobId,
        });

        // Send email to candidate
        sendEmail(
            candidate.email,
            'Application Deleted - Story Frame Studio',
            `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${candidate.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Your application for the job <strong>${job.title}</strong> has been deleted. If this was a mistake or you have any questions, please contact our support team.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
        );

        // Send email to employer
        sendEmail(
            employer.email,
            'Application Deleted - Story Frame Studio',
            `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${employer.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  The application from <strong>${candidate.firstName} ${candidate.lastName}</strong> for the job <strong>${job.title}</strong> has been deleted by the candidate.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
        );

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