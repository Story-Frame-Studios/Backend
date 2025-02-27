import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    companyName:{
        type:String,
        required:true
    },
    employerId:{
        type:String,
        required:true
    },
    requirements: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location:{
        type:String,
        required: true
    },
    jobType:{
        type: String,
        required: true,
        enum: ["Full-Time", "Part-Time"],
    },
    applications: {
        type: [String], // Array of strings
        default: [],    // Default to an empty array
        ref:"applications"
    }
},{ collection: 'jobpostings' });

const jobPostings = mongoose.model('jobPostings', JobSchema);

export default jobPostings;