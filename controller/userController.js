import User from '../models/User.js';
import { Recipe } from "../model/models.js";
import RecipeController from "../controller/recipeController.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({message: "User not found."});
      }

      const isValidPass = await bcrypt.compare(password, user.password);

      if (user && isValidPass) {
        // const token = jwt.sign({id: user._id}, "159d86da542f791a23cca61d76ae243c0464fbb594212e2332fb5946b23a18fd",
        //   {expiresIn: "1h"});

        // return res.status(200).json({ message: "Login successful", token, user });

        res.redirect('/admin/home');
        // return {
        //     statusCode: 200,
        //     headers: {
        //   "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        //   "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        //   "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
        //   "Access-Control-Allow-Methods": "POST, OPTIONS"
        //     },
        //     token,
        //     user,
        //     body: JSON.stringify(item)
        // };

      } else {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error while logging", error });
    }
  },

  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password
      });

      await user.save();

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
  },

  findUserById: async (req, res) => {
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
  },

  getAllUsers: async (_req, res) => {
    const users = await User.find();
    res.status(200).json(users);
  },

  saveFavorites: async (req, res) => {
    const { username, recipeId } = req.body;
    try {
      const recipe = await Recipe.findById(recipeId);
      const user = await User.findOne({username});

      if (recipe && user) {
        const isFavorite = user.favorites.includes(recipeId);
        if (isFavorite) {
          user.favorites.pull(recipeId);
          await user.save();
          return res.status(200).json({message: "You pulled a recipe from your favorites recipe list."});
        } else {
          user.favorites.push(recipeId);
          await user.save();
          return res.status(200).json({message: "You added a new recipe to your favorites recipe list."});
        }
      } else {
        return res.status(404).json({message: "You missed recipe id or username"});
      }
    } catch (error) {
      res.status(500).json({message: "There something be wrong ", error});
    }
  },

  isContainsRecipe: async (req, res) => {
    const { username, recipeId } = req.body;
    try {
      const user = await User.findOne({username});
      if (user) {
        if (user.favorites.includes(recipeId)) {
          return res.status(200).json({message: "Recipe found in favorite"});
        } else {
          return res.status(200).json({message: "Recipe not found in favorite"});
        }
      } else {
        return res.status(404).json({message: "User not found"});
      }
    } catch (error) {
      res.status(500).json({mesasge: error});
    }
  },

  favorites: async (req, res) => {
    const {username} = req.body;
    const userExists = await User.findOne({username});
    if (userExists) {
      const favoritesListNums = userExists.favorites.length;
      let recipes = [];
      if (favoritesListNums > 0) {
        for (let recipeId of userExists.favorites) {
          let recipe = await RecipeController.getRecipeByIdWithoutReq(recipeId);
          if (recipe != null) {
            recipes.push(recipe);
          }
        }
      }
      return res.status(200).json({favoritesNums: favoritesListNums, recipes: recipes});
    } else {
      return res.status(404).json({message: "User not found"});
    }
  },

  getFavoritesLength: async (req, res) => {
    const {username} = req.body;
    const userExists = await User.findOne({username});
    if (userExists) {
      const favoritesListNums = userExists.favorites.length;
      return res.status(200).json({favoritesNums: favoritesListNums});
    } else {
      return res.status(404).json({message: "User not found"});
    }
  }
};

export default UserController;
