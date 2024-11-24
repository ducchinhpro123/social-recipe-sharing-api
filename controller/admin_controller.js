import RecipeController from "../controller/recipeController.js";
import {Recipe}         from "../model/models.js";
import { User }         from "../model/models.js";

import bcrypt           from 'bcrypt';
import UserController from "./userController.js";
// import jwt              from 'jsonwebtoken';

class AdminController {
  static async users(req, res) {
    try {
      const users = await User.find();

      if (users.length < 0) {
        return res.render('users', {'users': []});
      }
      return res.render('users', {'users': users});
    } catch (error) {
      console.error('An error has occur:', error);
      res.render('error', {'message': error});
    }
  }

  static async searchUser(req, res) {
    const { q } = req.query;
    if (!q) {
      return res.render('users', {'message': 'Parameter q is required.', 'users': []});
    }
    try {
      const users = await User.find({username: q});
      if (users) {
        return res.render('users', {'users': users});
      }
      return res.render("users", {'message': 'No user found', 'users': []});
    } catch (error) {
      console.error('Error searching users:', error);
      res.render('error', {'message': error});
    }
  }

  static async searchRecipes(req, res) {
    const { q } = req.query;

    if (!q) {
      return res.render('table', {'message': "Parameter q is required.", 'recipes': []});
    }

    try {
      // Search for case-insensitive
      const recipes = await Recipe.find({ title: { $regex: q, $options: 'i' } });
      if (recipes.length === 0) {
        return res.render('table', {'message': "No recipe found.", 'recipes': []});
      }
      res.render('table', { recipes });
    } catch (error) {
      console.error('Error searching recipes:', error);
      res.render('error', {'message': e});
    }
  }

  static async addNewRecipeRequest(req, res) {
    const userId = req.session.user._id; // Admin
    const { title, description, ingredients, category, prepTime, difficulty, cookTime, images, instructions} = req.body;

    const newRecipe = new Recipe({
      userId: userId,
      title: title,
      description: description,
      ingredients: JSON.parse(ingredients),
      category: category,
      prepTime: prepTime,
      difficulty: difficulty,
      cookTime: cookTime,
      images: images,
      instructions: instructions,
    });

    try {
      await newRecipe.save();
      res.redirect('/admin/home');
    } catch (error) {
        res.render('error', {'message': error});
    }
  }

  static async addNewRecipe(req, res) {
    res.render('add_new_recipe');
  }

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

  static async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById({_id: id});
      if (user) {
        await User.deleteOne(user);
        return res.redirect('/admin/home/users');
      } else {
        res.render('error', {'message': 'User not found'});
      }
    } catch (error){
      console.error("There was an error: ", e);
      return res.render('error', {'message': 'Sorry! there something be wrong with the system: ', error});
    }
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

  static async updateUserPost(req, res) {

    // xn sf{ username: 'asdf', bio: 'asdf' }
    const { _id, username, bio } = req.body;
    try {
      const user = await User.findById({_id});
      if (!user) {
        return res.redirect("404", {message: "User not found"});
      } 

      if (username) user.username = username;
      if (bio)      user.bio = bio;
      try {
        await user.save();
        return res.redirect("/admin/home/users");
      } catch (error) {
        return res.redirect("404", {message: "There was an error why trying to save user: ", error});
      }
    } catch (error) {
      console.error("There is something went wrong", error);
      return res.redirect("404", {message: error});
    }

  }

  static async updateRecipePost(req, res) {
    const {_id, title, description, instructions, prepTime, ingredients, category, cookTime, difficulty, images} = req.body;
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
        if (images)       recipe.images       = images;

        if (ingredients) {
          try {
            recipe.ingredients = JSON.parse(ingredients);
          } catch (error) {
              res.render('error', {'message': error});
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

  static async updateUserPage(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return redirect('404', {'message': 'User\'id not found'});
      }

      let user = await User.findById({_id: id});

      if (user != null) {
        return res.render('user_update', {'user': user, '_id': id});
      } else {
        return res.render('error', {'message': 'User not found'});
      }
    } catch (error) {
      return res.render('error', {'message': error});
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

  static async home(req, res) {
    let recipes = await RecipeController.getAllRecipesAdmin();
    res.render('table', {'recipes': recipes});
  }
}

export default AdminController;
