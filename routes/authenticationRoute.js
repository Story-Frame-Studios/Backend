import express from 'express';
import { login ,register, verifyEmployer, logout,forgotPassword, getPendingEmployers} from '../controllers/Auth/Auth.js';
import verifyRole from '../middleware/verifyRole.js'; 
import verifyUser from '../middleware/verifyUser.js'; 
import { updateProfile, changePassword } from '../controllers/Auth/update-profile.js';

const router = express.Router();

// POST route for login
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password',forgotPassword)
router.get("/verify-employer", verifyEmployer);
router.post('/logout', logout); 
router.get('/pending-employers', getPendingEmployers)
router.put('/update-profile', updateProfile);
router.put('/change-password', changePassword);
// Candidate-only route
router.post("/candidate-dashboard", verifyUser, verifyRole("candidate"), (req, res) => {
    res.json({ message: "Welcome Candidate!", user: req.user });
});

// Employer-only route
router.post("/employer-dashboard", verifyUser, verifyRole("employer"), (req, res) => {
    res.json({ message: "Welcome Employer!", user: req.user });
});


export default router;
