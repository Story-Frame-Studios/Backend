import applicationCollection from '../../models/applicationCollection.js';// Assuming you have an Application model

// Delete application by ID
const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find and delete the application
        const deletedApplication = await applicationCollection.findOneAndDelete({applicationId});
        console.log(applicationId);
        
        
        if (!deletedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully', deletedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export default deleteApplication;
