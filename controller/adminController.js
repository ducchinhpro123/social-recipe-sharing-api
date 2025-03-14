import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const AdminController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: "Admin not found." });
      }

      // Check if user is an admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: "User is not an admin." });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || "159d86da542f791a23cca61d76ae243c0464fbb594212e2332fb5946b23a18fd",
        { expiresIn: "1h" }
      );

      // Return success response with token and admin user data
      return res.status(200).json({
        message: "Admin login successful",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ message: "Error while logging in", error: error.message });
    }
  },
};

export default AdminController;
