import express from 'express';
import { login } from '../controllers/Auth/Auth.js';

const router = express.Router();

// POST route for login
router.post('/login', login);

export default router;
