import { User } from "../model/models.js";

import {inspect} from "util";

class UserController {
  static async getAllUsers(req, res) {
    const users = await User.find();
    res.status(200).json(users);
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user && user.password === password) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error while logging", error });
    }
  }

  static async register(req, res) {
    try {
      const { username, password } = req.body;
      const newUser = new User({
        username,
        password,
      });
      await newUser.save();
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error while registering new user", error });
    }
  }
  static async findUserById(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log("Error finding user: ", error);
    }
  }
}

export default UserController;
