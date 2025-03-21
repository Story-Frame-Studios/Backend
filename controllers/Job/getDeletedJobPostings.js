import deletedJobPostings from "../../models/deletedJobPostings.js";

const getDeletedJobPostings = async (req, res) => {
    try {
        const { employerId } = req.params;
        const deletedJobPosting = await deletedJobPostings.find({ employerId });

        if (!deletedJobPosting.length) {
            return res.status(200).json({ success: true,message: "No deleted job postings found for this employer." });
        }

        res.status(200).json({ success: true, deletedJobPosting });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getDeletedJobPostings;