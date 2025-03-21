import mongoose from 'mongoose';

const DeletedJobSchema = new mongoose.Schema({
    jobId: String,
    title: String,
    companyName: String,
    employerId: String,
    requirements: String,
    description: String,
    salary: String,
    location: String,
    jobType: {
        type: String,
        enum: ["Full-Time", "Part-Time"]
    },
    applications: {
        type: [String], // Store application IDs
        default: []
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'deletedJobPostings' });

const deletedJobPostings = mongoose.model('deletedJobPostings', DeletedJobSchema);

export default deletedJobPostings;
