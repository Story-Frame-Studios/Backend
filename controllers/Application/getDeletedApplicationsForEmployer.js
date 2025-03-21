import deletedApplications from '../../models/deletedApplications.js';
import jobPostings from '../../models/jobPostings.js';
import deletedJobPostings from '../../models/deletedJobPostings.js'; // Import deleted job postings model

// Get deleted applications by Employer ID
const getDeletedApplicationsForEmployer = async (req, res) => {
    try {
        const { employerId } = req.params;

        // Find job postings (both active and deleted) that belong to the employer
        const activeJobs = await jobPostings.find({ employerId }).select('jobId');
        const deletedJobs = await deletedJobPostings.find({ employerId }).select('jobId');

        const jobIds = [...activeJobs.map(job => job.jobId), ...deletedJobs.map(job => job.jobId)];

        if (jobIds.length === 0) {
            return res.status(200).json({ message: "No deleted applications found for this employer." });
        }

        // Fetch all deleted applications related to the employer's job postings
        const deletedApplicationsList = await deletedApplications.find({ jobId: { $in: jobIds } });

        if (!deletedApplicationsList.length) {
            return res.status(200).json({ message: "No deleted applications found for this employer." });
        }

        // Format deleted applications with job details
        const formattedDeletedApplications = await Promise.all(
            deletedApplicationsList.map(async (app) => {
                let job;
                if (app.reason === "Employer Removed this Job Posting..!") {
                    job = await deletedJobPostings.findOne({ jobId: app.jobId }); // Search in deletedJobPostings
                } else {
                    job = await jobPostings.findOne({ jobId: app.jobId }); // Search in jobPostings
                }
                return {
                    ...app.toObject(),
                    jobTitle: job?.title || "Unknown Job",
                    companyName: job?.companyName || "Unknown Company",
                };
            })
        );

        res.status(200).json({ success: true, deletedApplications: formattedDeletedApplications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getDeletedApplicationsForEmployer;
