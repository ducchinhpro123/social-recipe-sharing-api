import RecipeController from "../controller/recipeController.js";
import {Recipe}         from "../model/models.js";
import { User }         from "../model/models.js";

import bcrypt           from 'bcrypt';
// import jwt              from 'jsonwebtoken';

class AdminController {
  static async loginRequest(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });

      if (!user) {
        res.render('error', {'message': 'User not found'});
      }

      const isValidPass = await bcrypt.compare(password, user.password);

      if (user && isValidPass) {
        // const token = jwt.sign({id: user._id}, "159d86da542f791a23cca61d76ae243c0464fbb594212e2332fb5946b23a18fd",
        //   {expiresIn: "1h"});
        req.session.user = user;
        res.redirect('/admin/home');
      } else {
        res.render('error', {'message': 'Invalid username or password'});
      }
    } catch (error) {
        res.render('error', {'message': error});
    }
  }

  static async login(req, res) {
    res.render('login');
  }

  static async deleteRecipe(req, res) {
    const id = req.params.id;
    try {
      const recipe = await Recipe.findById({_id: id});
      if (recipe) {
        await Recipe.deleteOne(recipe);
        res.redirect('/admin/home');
      } else {
        res.render('error', {'message': 'Recipe not found'});
      }
    } catch (error) {
      res.render('error', {'message': error});
    }
  }

  static async updateRecipePost(req, res) {
    const {_id, title, description, instructions, prepTime, ingredients, category, cookTime, difficulty} = req.body;
    try {
      const recipe = await Recipe.findById(_id);
      if (recipe) {
        if (title)        recipe.title        = title;
        if (description)  recipe.description  = description;
        if (instructions) recipe.instructions = instructions;
        if (prepTime)     recipe.prepTime     = prepTime;
        if (cookTime)     recipe.cookTime     = cookTime;
        if (category)     recipe.category     = category;
        if (difficulty)   recipe.difficulty   = difficulty;

        if (ingredients) {
          try {
            recipe.ingredients = JSON.parse(ingredients);
          } catch (error) {
            return res.status(400).json({message: "Invalid ingredients format"});
          }
        }

        await recipe.save();
        res.redirect("/admin/home");

      } else {
        res.render('error', {'message': 'Recipe not found'});
      }
    } catch (error) {
      res.render('error', {'message': error});
    }
  }

  static async updatePage(req, res) {
    try {
      const id = req.params.id;
      let recipe = await RecipeController.getRecipeByIdAdmin(id);
      if (recipe != null) {
        res.render('update', {'recipe': recipe});
      } else {
        res.render('error', {'message': 'Recipe not found'});
      }
    } catch (error) {
      res.render('error', {'message': error});
    }
  }

  static async home(_req, res) {
    let recipes = await RecipeController.getAllRecipesAdmin();
    res.render('table', {'recipes': recipes});
  }
}

export default AdminController;
