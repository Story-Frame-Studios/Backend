import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    
    userId:{
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["candidate", "employer", "under review", "admin", "rejected"],
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
},{ collection: 'users' });

const users = mongoose.model('users', UserSchema);

export default users;