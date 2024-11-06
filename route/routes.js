//### Authentication
//```javascript
//POST /api/auth/register
//POST /api/auth/login
//```
import express from 'express';
import { User } from '../model/models.js';

const router = express.Router();

router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && user.password == password) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while logging", error });
  }
});

router.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({
      username,
      password
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error while registering new user", error });
  };
});
