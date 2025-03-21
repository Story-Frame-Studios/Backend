import jobPostings from "../../models/jobPostings.js";
import applicationCollection from "../../models/applicationCollection.js";
import deletedJobPostings from "../../models/deletedJobPostings.js";
import deletedApplications from "../../models/deletedApplications.js";

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
                    reason:"Employer Removed this Job Posting..!",
                    createdAt: app.createdAt,
                    deletedAt: new Date()
                }))
            );
        }

        // Delete the job and its applications from the original collections
        await jobPostings.deleteOne({ jobId: jobId });
        await applicationCollection.deleteMany({ jobId: jobId });

        res.status(200).json({ message: 'Job and associated applications deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete job and applications', error: error.message });
    }
};

export { deleteJob };
