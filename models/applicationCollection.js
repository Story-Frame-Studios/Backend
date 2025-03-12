import mongoose from 'mongoose';

// Application Schema
const applicationSchema = new mongoose.Schema(
    {
        applicationId:{
            type: String,
            required: true, 
        },
        jobId: {
            type: String,
            required: true,
        },
        candidateId: {
            type: String,
            required: true,
        },
        resume: {
            type: String,
            required: true,
        },
        coverLetter: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['received', 'under review', 'hired', 'rejected'],
            default: 'received',
        },
        notes: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
);

// Application Model
const applicationCollection = mongoose.model('Application', applicationSchema);

export default applicationCollection;
