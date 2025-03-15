import applicationCollection from '../../models/applicationCollection.js';
import { invalidateApplicationCache } from '../../utils/cacheUtils.js';

const createApplication = async (req, res) => {
  const applicationData = req.body;

  try {
    const newApplication = await applicationCollection.create(applicationData);

    // Invalidate related caches
    await invalidateApplicationCache({
      candidateId: newApplication.candidateId,
      jobId: newApplication.jobId
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully!',
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create application.',
      error: error.message,
    });
  }
};

export default createApplication; 