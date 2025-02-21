import express from 'express';
import { login ,register, verifyEmployer} from '../controllers/Auth/Auth.js';

const router = express.Router();

// POST route for login
router.post('/login', login);
router.post('/register', register);
router.get("/verify-employer", verifyEmployer);
export default router;
