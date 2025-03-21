import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';
import users from '../../models/users.js';

const getApplicantsForEmployer = async (req, res) => {
    try {
        const { employerId } = req.params;

        // Step 1: Find all jobs posted by this employer
        const jobs = await jobPostings.find({ employerId }).select('jobId');
        if (!jobs.length) {
            return res.status(200).json({ success: true, message: 'No jobs found for this employer' });
        }

        // Extract job IDs
        const jobIds = jobs.map(job => job.jobId);

        // Step 2: Find all applications for the employer's jobs
        const applications = await applicationCollection.find({ jobId: { $in: jobIds } }).select('candidateId jobId');

        if (!applications.length) {
            return res.status(200).json({ success: true, totalApplicants: 0, applicants: [] });
        }

        // Step 3: Count unique applicants and track how many jobs each candidate applied for
        const applicantMap = new Map();

        applications.forEach(application => {
            const candidateId = application.candidateId;
            if (applicantMap.has(candidateId)) {
                applicantMap.get(candidateId).noOfJobs += 1;
            } else {
                applicantMap.set(candidateId, { candidateId, noOfJobs: 1 });
            }
        });

        // Step 4: Fetch user details for unique applicants
        const uniqueCandidateIds = Array.from(applicantMap.keys());
        const userRecords = await users.find({ userId: { $in: uniqueCandidateIds } })
            .select('userId firstName lastName email');

        // Step 5: Format the response, ensuring userId exists in applicantMap
        const applicantsData = userRecords.map(user => {
            const applicant = applicantMap.get(user.userId) || { noOfJobs: 0 };
            return {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                noOfJobs: applicant.noOfJobs,
            };
        });

        res.status(200).json({
            success: true,
            totalApplicants: applicantsData.length,
            applicants: applicantsData,
        });

    } catch (error) {
        console.error('Error fetching applicants for employer:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default getApplicantsForEmployer;
