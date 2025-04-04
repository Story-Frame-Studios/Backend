import bcrypt from 'bcryptjs';// Assuming you have a users model
import users from "../../models/users.js";

// Update Profile Function
export const updateProfile = async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
  
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const user = await users.findOne({ email: email });  // Find by email instead of user id
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      await user.save();
  
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword, email } = req.body;  // Assuming email is passed in the body for finding user
  
      if (!currentPassword || !newPassword || !email) {
        return res.status(400).json({ message: 'Email and both passwords are required' });
      }
  
      const user = await users.findOne({ email: email });  // Find user by email
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
    

