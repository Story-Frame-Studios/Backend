import express from 'express';
import { login ,register, verifyEmployer, logout} from '../controllers/Auth/Auth.js';
import verifyRole from '../middleware/verifyRole.js'; 
import verifyUser from '../middleware/verifyUser.js'; 

const router = express.Router();

// POST route for login
router.post('/login', login);
router.post('/register', register);
router.get("/verify-employer", verifyEmployer);
router.post('/logout', logout); 

// Candidate-only route
router.post("/candidate-dashboard", verifyUser, verifyRole("candidate"), (req, res) => {
    res.json({ message: "Welcome Candidate!", user: req.user });
});

// Employer-only route
router.post("/employer-dashboard", verifyUser, verifyRole("employer"), (req, res) => {
    res.json({ message: "Welcome Employer!", user: req.user });
});


export default router;
