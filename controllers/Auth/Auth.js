import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import users from '../../models/users.js';
import jwt from 'jsonwebtoken';
import { generateRandomPassword } from '../../utils/randomPassword.js';

import { sendEmail } from '../../service/emailService.js';
// Make sure the User model is correctly imported
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
console.log(req.body, "body")
    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (role === "candidate") {
      // Send Welcome Email
      sendEmail(
        email,
        "Welcome to Story Frame Studio!",
        `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Welcome to <strong>Story Frame Studio</strong>! We're excited to have you on board. 
  <br><br>
  Explore a world of job opportunities and kickstart your journey with us today! We're here to help you take the next steps in your career.
</p>

<div style="text-align: center; margin-top: 30px;">
  <a href="http://localhost:4000/story" 
     style="padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
    Explore Job Opportunities
  </a>
</div>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>
`
      );

      // Save Candidate to Database
      const newUser = new users({
        userId: uuidv4(),
        email,
        password: hashPassword,
        role,
        firstName,
        lastName,
      });
      await newUser.save();
      return res.status(201).json({  success: true,message: "Candidate registered successfully" });
    }

    if (role === "employer") {
      // Save Employer as Under Review (Don't set the role yet)
      const newUser = new users({
        userId: uuidv4(),
        email,
        password: hashPassword,
        role: "under review",  // Role is "under review"
        firstName,
        lastName,
      });

      await newUser.save();

      // Send Email to Employer (Under Review)
      sendEmail(
        email,
        "Account Under Review - Story Frame Studio",
        `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Thank you for registering as an employer on Story Frame Studio! We're excited to have you on board.
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  Our team will review your account and send you a confirmation once it's approved. In the meantime, feel free to explore our platform and check out the opportunities available.
</p>

<div style="text-align: center; margin-top: 30px;">
  <a href="http://localhost:4000/story" 
     style="padding: 15px 30px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
    Visit Our Platform
  </a>
</div>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions, feel free to contact our support team at <a href="mailto:storyframestudio01@gmail.com" style="color: #007BFF;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>
`
      );

      // Generate Approval & Rejection Links for Admin Approval

      // Send Approval Request Email to Admin
      sendEmail(
        "storyframestudio01@gmail.com",
        "Employer Approval Request - Story Frame Studio",
        `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  A new employer has registered on Story Frame Studio:
</p>
<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  <strong>Name:</strong> ${firstName} ${lastName}<br>
  <strong>Email:</strong> ${email}
</p>
<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Please review and take action:
</p>

<div style="text-align: center; margin-top: 20px;">
  <a href="http://localhost:4000/story/auth/verify-employer?email=${email}&action=approve" 
     style="padding: 15px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 0 10px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
    Approve
  </a>

  <a href="http://localhost:4000/story/auth/verify-employer?email=${email}&action=reject" 
     style="padding: 15px 30px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 0 10px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
    Reject
  </a>
</div>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:storyframestudio01@gmail.com" style="color: #007BFF;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>
`
      );

      return res.status(200).json({ success: true, message: "Employer registration under review" });
    }

    return res.status(400).json({ error: "Invalid role" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Use a strong secret key from .env
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // Send token to client
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const verifyEmployer = async (req, res) => {
  try {
    const { email, action } = req.query;
    
    if (!email || !action) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Find the user by email and check if their role is "under review"
    const user = await users.findOne({ email, role: "under review" });

    if (!user) {
      return res.status(404).json({ error: "Employer not found or already processed" });
    }

    if (action === "approve") {
      user.role = "employer";
      await user.save();

      // Send approval email to employer
      sendEmail(
        email,
        "Your Account is Approved - Story Frame Studio",
        `Dear ${user.firstName},\n\nYour account has been approved. You can now log in to Story Frame Studio.\n\nBest regards,\nStory Frame Studio Team`
      );

      return res.status(200).json({ success: true, message: "Employer approved successfully" });
    }

    if (action === "reject") {
      // Delete the user account if rejected
      await users.findByIdAndDelete(user._id);
      
      // Send rejection email to employer
      sendEmail(
        email,
        "Your Registration was Rejected - Story Frame Studio",
        `Dear ${user.firstName},\n\nUnfortunately, your registration request was rejected.\n\nBest regards,\nStory Frame Studio Team`
      );

      return res.status(200).json({ success: true, message: "Employer rejected" });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Error verifying employer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists in the database
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User with this email does not exist' });
    }

    // Generate a new random password
    const newPassword = generateRandomPassword(12);  // You can set your preferred length here

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    // Send email with the new password
    sendEmail(
      email,
      "Your New Password - Story Frame Studio",
      `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
  Dear ${user.firstName},
</p>

<p style="font-family: Arial, sans-serif; color: #555; font-size: 16px;">
  We received a request to reset your password. Here is your new password:
  <strong>${newPassword}</strong>
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
  If you did not request this change, please contact our support team immediately at <a href="mailto:storyframestudio01@gmail.com" style="color: #28a745;">storyframestudio01@gmail.com</a>.
</p>

<p style="font-family: Arial, sans-serif; color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
  Best regards, <br>
  Story Frame Studio Team
</p>`
    );

    // Return success response
    return res.status(200).json({ success: true, message: 'A new password has been sent to your email' });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const logout = (req, res) => {
  try {
      res.clearCookie('token');
      res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

const getPendingEmployers = async (req, res) => {
  try {
    const pendingEmployers = await users.find({ role: "under review" });
    res.status(200).json({ 
      success: true, 
      employers: pendingEmployers.map(user => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId
      }))
    });
  } catch (error) {
    console.error("Error fetching pending employers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await users.findById(req.user.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { login, register, verifyEmployer, forgotPassword, logout, getPendingEmployers, isAdmin };
