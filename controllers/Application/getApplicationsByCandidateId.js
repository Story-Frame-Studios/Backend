import applicationCollection from '../../models/applicationCollection.js';

const getApplicationsByCandidateId = async (req, res) => {
    const { candidateId } = req.body;  // Extract candidateId from URL parameters

    try {
        // Find all applications for the given candidateId
        const applications = await applicationCollection.find({ candidateId });
        

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No applications found for this candidate.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully!',
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications.',
            error: error.message,
        });
    }
};

export default getApplicationsByCandidateId;
