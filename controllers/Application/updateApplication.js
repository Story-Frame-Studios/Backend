import applicationCollection from '../../models/applicationCollection.js';
import { invalidateApplicationCache } from '../../utils/cacheUtils.js';

const updateApplication = async (req, res) => {
  const { applicationId } = req.params;
  const updateData = req.body;

  try {
    const updatedApplication = await applicationCollection.findOneAndUpdate(
      { applicationId },
      updateData,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Invalidate related caches
    await invalidateApplicationCache({
      applicationId,
      candidateId: updatedApplication.candidateId,
      jobId: updatedApplication.jobId
    });

    res.status(200).json({
      success: true,
      message: 'Application updated successfully!',
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application.',
      error: error.message,
    });
  }
};

export default updateApplication; 