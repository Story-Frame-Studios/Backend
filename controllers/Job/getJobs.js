import Job from '../../models/jobPostings.js'

const getJobs = async (req, res) => {
    try {
        const job = await Job.find();
        console.log(job);
        res.status(200).json({ success: true,data:job });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export {getJobs};