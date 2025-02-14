import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
 // Make sure the User model is correctly imported

const login = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Login successful", // Send the token to the client if needed
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { login };
