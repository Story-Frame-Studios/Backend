import jobPostings from "../../models/jobPostings.js";

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Use jobId inside the object as search condition
        const result = await jobPostings.findOneAndDelete({ jobId: jobId });

        // If no job is found and deleted, return a 404
        if (!result) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(500).json({ message: 'Failed to delete job', error: error.message });
    }
};

export { deleteJob };
