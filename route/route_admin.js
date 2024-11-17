import express           from "express";
import AdminController   from "../controller/admin_controller.js";
import {isAuthenticated} from "../middleware/auth.js";

export const adminRouter = express.Router();

adminRouter.get("/login",               AdminController.login);
adminRouter.post("/login-request",      AdminController.loginRequest);
adminRouter.get("/home",                isAuthenticated, AdminController.home);
adminRouter.get("/recipe/update/:id",   isAuthenticated, AdminController.updatePage);
adminRouter.post("/recipe/update/",     isAuthenticated, AdminController.updateRecipePost);
adminRouter.get("/recipe/delete/:id",   isAuthenticated, AdminController.deleteRecipe);


