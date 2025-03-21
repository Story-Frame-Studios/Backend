import mongoose from 'mongoose';

const DeletedApplicationSchema = new mongoose.Schema({
    applicationId: String,
    jobId: String,
    candidateId: String,
    resume: String,
    coverLetter: String,
    status: String,
    notes: String,
    createdAt: Date,
    reason:String,
    deletedAt: {
        type: Date,
        default: Date.now
    },
}, { collection: 'deletedApplications' });

const deletedApplications = mongoose.model('deletedApplications', DeletedApplicationSchema);

export default deletedApplications;
