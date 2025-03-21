import deletedApplications from '../../models/deletedApplications.js';
import jobPostings from '../../models/jobPostings.js';
import deletedJobPostings from '../../models/deletedJobPostings.js'; // Import deleted job postings model

// Get deleted applications by Candidate ID
const getDeletedApplications = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const deletedApplication = await deletedApplications.find({ candidateId });

        if (!deletedApplication.length) {
            return res.status(200).json({ message: "No deleted applications found for this candidate." });
        }

        // Fetch job details for each deleted application based on reason
        const formattedDeletedApplications = await Promise.all(
            deletedApplication.map(async (app) => {
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

export default getDeletedApplications;
