import applicationCollection from '../../models/applicationCollection.js';
import jobPostings from '../../models/jobPostings.js';

const getAppliedApplicationsByCandidate = async (req, res) => {
    try {
        const { employerId, candidateId } = req.params;
        

        const result = await applicationCollection.aggregate([
            {
                $lookup: {
                    from: 'jobpostings', // Collection name
                    localField: 'jobId',
                    foreignField: 'jobId',
                    as: 'jobDetails'
                }
            },
            {
                $match: {
                    candidateId: candidateId,
                    'jobDetails.employerId': employerId
                }
            },
            {
                $unwind: '$jobDetails'
            },
            {
                $project: {
                    _id: 0,
                    applicationId: 1,
                    status: 1,
                    appliedDate: '$createdAt',
                    jobId: '$jobDetails.jobId',
                    jobTitle: '$jobDetails.title',
                    companyName: '$jobDetails.companyName'
                }
            }
        ]);

        if (!result.length) {
            return res.status(200).json({ success: true, totalApplications: 0, applications: [] });
        }

        res.status(200).json({
            success: true,
            candidateId,
            totalApplications: result.length,
            applications: result
        });

    } catch (error) {
        console.error('Error fetching candidate applications:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default getAppliedApplicationsByCandidate;
