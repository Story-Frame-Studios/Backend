import jobPostings from "../../models/jobPostings.js";

const getJobDetails = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        console.log(jobId, "idddd");

        // Attempt to find job by ID
        const job = await jobPostings.findOne({ jobId: jobId});

        // If job not found
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Return job data if found
        res.status(200).json({ success: true,data:job });
    } catch (error) {
        console.error(error);  // Log the error to the console
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export default getJobDetails;