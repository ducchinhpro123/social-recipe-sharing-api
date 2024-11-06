//### Authentication
//```javascript
//POST /api/auth/register
//POST /api/auth/login
//```
import express from 'express';
import { login, register, findUserById } from '../controller/userController.js';
import {getAllRecipes, getRecipeById, saveRecipe} from '../controller/recipeController.js';

export const router = express.Router();

/*      ------ Authentication and user query ------       */
router.post('/api/auth/login', login);
router.post('/api/auth/register', register);
router.post('/api/users/:id', findUserById);


//POST /api/users/follow/:id
//DELETE /api/users/unfollow/:id
//GET /api/users/:id/followers
//GET /api/users/:id/following
//```
//
//### Recipe Operations
//```javascript
//POST /api/recipes
//GET /api/recipes


/*      ------ RECIPE ------       */
router.post("/api/recipes/", saveRecipe);
router.get("/api/recipes", getAllRecipes);
router.get("/api/recipes/:id", getRecipeById);

//PUT /api/recipes/:id
//DELETE /api/recipes/:id
//GET /api/recipes/search
//GET /api/recipes/categories
//POST /api/recipes/:id/like
//POST /api/recipes/:id/rate
//POST /api/recipes/:id/comment
//```
