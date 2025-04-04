import jobPostings from "../../models/jobPostings.js";
import applicationCollection from "../../models/applicationCollection.js";
import deletedJobPostings from "../../models/deletedJobPostings.js";
import deletedApplications from "../../models/deletedApplications.js";
import users from "../../models/users.js"; // Import the users model to fetch candidate and employer details
import { sendEmail } from "../../service/emailService.js"; // Import the email service

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job to delete
        const job = await jobPostings.findOne({ jobId: jobId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Find all applications related to this job
        const applications = await applicationCollection.find({ jobId: jobId });

        // Fetch employer details
        const employer = await users.findOne({ userId: job.employerId });
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        // Move job to deletedJobPostings
        await deletedJobPostings.create({
            jobId: job.jobId,
            title: job.title,
            companyName: job.companyName,
            employerId: job.employerId,
            requirements: job.requirements,
            description: job.description,
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            applications: applications.map(app => app.applicationId),
            deletedAt: new Date()
        });

        // Move applications to deletedApplications
        if (applications.length > 0) {
            await deletedApplications.insertMany(
                applications.map(app => ({
                    applicationId: app.applicationId,
                    jobId: app.jobId,
                    candidateId: app.candidateId,
                    resume: app.resume,
                    coverLetter: app.coverLetter,
                    status: app.status,
                    notes: app.notes,
                    reason: "Employer Removed this Job Posting..!",
                    createdAt: app.createdAt,
                    deletedAt: new Date()
                }))
            );
        }

        // Delete the job and its applications from the original collections
        await jobPostings.deleteOne({ jobId: jobId });
        await applicationCollection.deleteMany({ jobId: jobId });

        // Send email to employer
        sendEmail(
            employer.email,
            'Job Posting Deleted - Story Frame Studio',
            `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${employer.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Your job posting for <strong>${job.title}</strong> has been successfully deleted. All associated applications have also been removed.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
        );

        // Send email to all candidates who applied for the job
        for (const application of applications) {
            const candidate = await users.findOne({ userId: application.candidateId });
            if (candidate) {
                sendEmail(
                    candidate.email,
                    'Job Posting Deleted - Story Frame Studio',
                    `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${candidate.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  The job posting for <strong>${job.title}</strong> that you applied for has been deleted by the employer. As a result, your application has also been removed.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
                );
            }
        }

        res.status(200).json({ message: 'Job and associated applications deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete job and applications', error: error.message });
    }
};

export { deleteJob };