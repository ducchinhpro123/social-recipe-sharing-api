import express from "express";
import UserController from "../controller/userController.js";
import RecipeController from "../controller/recipeController.js";
import AdminController from "../controller/adminController.js"; // Import AdminController
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { Recipe } from "../model/models.js";
import User from "../models/User.js";

export const router = express.Router();

// Web UI Routes for authentication and basic pages
router.get('/', async (req, res) => {
  try {
    // Get featured recipes (latest 3)
    const featuredRecipes = await Recipe.find().sort({createdAt: -1}).limit(3);
    
    res.render('home', { 
      title: 'Recipe Sharing Platform',
      user: req.session.user || null,
      featuredRecipes
    });
  } catch (error) {
    res.render('home', { 
      title: 'Recipe Sharing Platform',
      user: req.session.user || null,
      featuredRecipes: []
    });
  }
});

router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register', 
    error: req.flash('error'), 
    success: req.flash('success')
  });
});

router.post('/register', register);

router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login', 
    error: req.flash('error'), 
    success: req.flash('success')
  });
});

router.post('/login', login);
router.get('/logout', logout);

// Dashboard route (protected)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Get user's recipes
    const userRecipes = await Recipe.find({ userId: req.session.user.id }).limit(5);
    
    // Get user's favorite recipes
    const user = await User.findById(req.session.user.id);
    const favoriteRecipes = await Recipe.find({ _id: { $in: user.favorites || [] } }).limit(5);
    
    // Get all recipes for browse section
    const allRecipes = await Recipe.find().sort({createdAt: -1}).limit(10);
    
    res.render('dashboard', { 
      title: 'Dashboard',
      user: req.session.user,
      userRecipes,
      favoriteRecipes,
      allRecipes
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('dashboard', { 
      title: 'Dashboard',
      user: req.session.user,
      userRecipes: [],
      favoriteRecipes: [],
      allRecipes: []
    });
  }
});

// Recipe routes for web UI - specific routes first
router.get('/recipes/new', isAuthenticated, (req, res) => {
  res.render('recipes/new', {
    title: 'Create New Recipe',
    user: req.session.user
  });
});

router.post('/recipes/new', isAuthenticated, async (req, res) => {
  try {
    console.log("Full request body:", req.body);
    
    const { 
      title, description, prepTime, cookTime, difficulty, category,
      ingredientName, ingredientAmount, ingredientUnit, instructions
    } = req.body;
    
    // Debug logging
    console.log("title:", title);
    console.log("description:", description);
    console.log("prepTime (raw):", prepTime);
    console.log("cookTime (raw):", cookTime);
    console.log("difficulty:", difficulty);
    console.log("category:", category);
    
    // Set default values if fields are undefined
    const prepTimeValue = prepTime !== undefined ? prepTime : "0";
    const cookTimeValue = cookTime !== undefined ? cookTime : "0";
    
    console.log("prepTimeValue:", prepTimeValue);
    console.log("cookTimeValue:", cookTimeValue);
    
    // Ensure values are properly converted to numbers with fallbacks
    const prepTimeNum = prepTimeValue === '' ? 0 : Number(prepTimeValue);
    const cookTimeNum = cookTimeValue === '' ? 0 : Number(cookTimeValue);
    
    console.log("prepTimeNum:", prepTimeNum);
    console.log("cookTimeNum:", cookTimeNum);
    
    // Explicit validation with better error messages
    if (isNaN(prepTimeNum)) {
      console.error(`Invalid prepTime: '${prepTime}', type: ${typeof prepTime}`);
      return res.status(400).render('error', {
        title: 'Invalid Input',
        message: `Prep time must be a valid number. Received: ${prepTime} (${typeof prepTime})`,
        user: req.session.user
      });
    }
    
    if (isNaN(cookTimeNum)) {
      console.error(`Invalid cookTime: '${cookTime}', type: ${typeof cookTime}`);
      return res.status(400).render('error', {
        title: 'Invalid Input',
        message: `Cook time must be a valid number. Received: ${cookTime} (${typeof cookTime})`,
        user: req.session.user
      });
    }

    // Process ingredients with better validation
    const ingredients = [];
    if (Array.isArray(ingredientName)) {
      for (let i = 0; i < ingredientName.length; i++) {
        // Parse and validate amount
        const amountValue = ingredientAmount[i] === '' ? 0 : Number(ingredientAmount[i]);
        if (isNaN(amountValue)) {
          return res.status(400).render('error', {
            title: 'Invalid Input',
            message: `Ingredient amount must be a valid number. Received: ${ingredientAmount[i]}`,
            user: req.session.user
          });
        }
        
        ingredients.push({
          name: ingredientName[i],
          amount: amountValue,
          unit: ingredientUnit[i]
        });
      }
    } else if (ingredientName) {
      // Parse and validate single ingredient amount
      const amountValue = ingredientAmount === '' ? 0 : Number(ingredientAmount);
      if (isNaN(amountValue)) {
        return res.status(400).render('error', {
          title: 'Invalid Input',
          message: `Ingredient amount must be a valid number. Received: ${ingredientAmount}`,
          user: req.session.user
        });
      }
      
      ingredients.push({
        name: ingredientName,
        amount: amountValue,
        unit: ingredientUnit
      });
    }

    // Create new recipe with validated data
    const recipe = new Recipe({
      userId: req.session.user.id,
      title,
      description,
      prepTime: prepTimeNum,
      cookTime: cookTimeNum,
      difficulty,
      category: Array.isArray(category) ? category : [category],
      ingredients,
      instructions: Array.isArray(instructions) ? instructions : [instructions],
      images: ['default-recipe.jpg'] // Default image, will be replaced if user uploads an image
    });

    // Save the recipe
    await recipe.save();
    
    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while creating the recipe: ' + error.message,
      user: req.session.user
    });
  }
});

// User favorites page
router.get('/recipes/favorites', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const favoriteRecipes = await Recipe.find({ _id: { $in: user.favorites || [] } });
    
    res.render('recipes/favorites', {
      title: 'My Favorite Recipes',
      user: req.session.user,
      recipes: favoriteRecipes
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while loading your favorite recipes.',
      user: req.session.user
    });
  }
});

// User's recipes
router.get('/recipes/my', isAuthenticated, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.session.user.id });
    
    res.render('recipes/my-recipes', {
      title: 'My Recipes',
      user: req.session.user,
      recipes
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while loading your recipes.',
      user: req.session.user
    });
  }
});

// All recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({createdAt: -1});
    res.render('recipes/index', {
      title: 'All Recipes',
      user: req.session.user || null,
      recipes
    });
  } catch (error) {
    res.render('recipes/index', {
      title: 'All Recipes',
      user: req.session.user || null,
      recipes: []
    });
  }
});

// Single recipe - should come AFTER more specific routes
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).render('error', { 
        title: 'Recipe Not Found',
        message: 'The recipe you requested does not exist.',
        user: req.session.user || null
      });
    }
    
    res.render('recipes/detail', {
      title: recipe.title,
      user: req.session.user || null,
      recipe
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: 'An error occurred while loading the recipe.',
      user: req.session.user || null
    });
  }
});

// Add this route for debugging form submissions
router.post('/test-form', (req, res) => {
  console.log("Test Form - Full request body:", req.body);
  console.log("Test Form - prepTime:", req.body.prepTime, typeof req.body.prepTime);
  console.log("Test Form - cookTime:", req.body.cookTime, typeof req.body.cookTime);
  
  res.json({
    received: {
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime
    },
    parsed: {
      prepTime: Number(req.body.prepTime),
      cookTime: Number(req.body.cookTime)
    }
  });
});

// API Routes for Authentication
router.post("/api/auth/login", UserController.login);
router.post("/api/auth/register", (req, res) => {
  // Set headers to API response format
  req.headers.accept = 'application/json';
  register(req, res);
});

// Admin login route
router.post("/api/admin/login", AdminController.login);

/*      ------ User API routes ------       */
router.get("/api/users/:id", UserController.findUserById);
router.get("/api/users/", UserController.getAllUsers);
router.post("/api/users/favorites", UserController.saveFavorites);
router.post("/api/users/is-contains-favorites", UserController.isContainsRecipe);
router.post("/api/users/get-favorites", UserController.favorites);
router.post("/api/users/get-favorites-length", UserController.getFavoritesLength);

/*      ------ Recipe API routes ------       */
router.post("/api/recipes/", RecipeController.saveRecipe);
router.get("/api/recipes", RecipeController.getAllRecipes);
router.get("/api/recipes/:id", RecipeController.getRecipeById);
router.get("/api/recipes/delete/:id", RecipeController.deleteRecipe);
router.post("/api/recipes/update/", RecipeController.updateRecipe);
