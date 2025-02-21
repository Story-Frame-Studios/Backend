import jwt from "jsonwebtoken";
import users from "../models/users.js";

const verifyUser = async (req, res, next) => {
    try {
        const { token } = req.body; 
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in database
        const user = await users.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("Error in verifyUser middleware:", error);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export default verifyUser;