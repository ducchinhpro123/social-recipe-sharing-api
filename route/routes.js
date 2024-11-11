//### Authentication
//```javascript
//POST /api/auth/register
//POST /api/auth/login
//```
import express          from "express";
import UserController   from "../controller/userController.js";
import RecipeController from "../controller/recipeController.js";

export const router = express.Router();

/*      ------ Authentication and user query ------       */
router.post("/api/auth/login",    UserController.login);
router.post("/api/auth/register", UserController.register);
router.get("/api/users/:id",      UserController.findUserById);
router.get("/api/users/",         UserController.getAllUsers);

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
router.post("/api/recipes/",   RecipeController.saveRecipe);
router.get("/api/recipes",     RecipeController.getAllRecipes);
router.get("/api/recipes/:id", RecipeController.getRecipeById);

//PUT /api/recipes/:id
//DELETE /api/recipes/:id
//GET /api/recipes/search
//GET /api/recipes/categories
//POST /api/recipes/:id/like
//POST /api/recipes/:id/rate
//POST /api/recipes/:id/comment
//```
