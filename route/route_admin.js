import express           from "express";
import AdminController   from "../controller/admin_controller.js";
import {isAuthenticated} from "../middleware/auth.js";

export const adminRouter = express.Router();

adminRouter.get("/login",                       AdminController.login);
adminRouter.post("/login-request",              AdminController.loginRequest);

adminRouter.get("/home",                        isAuthenticated, AdminController.home);
adminRouter.get("/home/users/",                 isAuthenticated, AdminController.users);
adminRouter.get("/users/user/delete/:id",       isAuthenticated, AdminController.deleteUser);
adminRouter.post("/users/user/update/",         isAuthenticated, AdminController.updateUserPost);
adminRouter.get("/users/user/update/:id",       isAuthenticated, AdminController.updateUserPage);
adminRouter.get("/users/user/search/",          isAuthenticated, AdminController.searchUser);

adminRouter.get("/recipe/update/:id",           isAuthenticated, AdminController.updatePage);
adminRouter.post("/recipe/update/",             isAuthenticated, AdminController.updateRecipePost);
adminRouter.get("/recipe/delete/:id",           isAuthenticated, AdminController.deleteRecipe);
adminRouter.get("/recipe/add-new-recipe/",      isAuthenticated, AdminController.addNewRecipe);
adminRouter.post("/recipe/add-new-recipe/",     isAuthenticated, AdminController.addNewRecipeRequest);
adminRouter.get("/recipes/search/",             isAuthenticated, AdminController.searchRecipes);


