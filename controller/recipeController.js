import { Recipe } from "../model/models.js";

class RecipeController {
  /**
   *  All the functions that ends with admin are supposed use for admin-only
   * */
  static async getRecipeByIdAdmin(id) {
    try {
      const recipe = await Recipe.findById(id);
      return recipe ? recipe : null;
    } catch (error) {
      console.error(error);
      return  null;

    }
  }

  static async getAllRecipesAdmin() {
    try {
      const recipes = await Recipe.find();
      return recipes;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.find();
      res.status(201).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateRecipe(req, res) {
    const {_id, title, description, instructions, prepTime, ingredients, category} = req.body;
    try {
      const recipe = await Recipe.findById(_id);
      if (recipe) {
        if (title) recipe.title               = title;
        if (description) recipe.description   = description;
        if (instructions) recipe.instructions = instructions;
        if (prepTime) recipe.prepTime         = prepTime;
        if (category) recipe.category         = category;
        if (ingredients) {
          try {
            recipe.ingredients = JSON.parse(ingredients);
          } catch (error) {
            return res.status(400).json({message: "Invalid ingredients format"});
          }
        }
        await recipe.save();
        return res.status(200).json({message: "Updated successfully"});
      } else {
        return res.status(404).json({message: "No recipe found"});
      }
    } catch (error) {
      return res.status(500).json({mesage: error});
    }

  }

  static async deleteRecipe(req, res) {
    const id = req.params.id;
    try {
      const recipe = await Recipe.findById({_id: id});
      if (recipe) {
        await Recipe.deleteOne(recipe);
        return res.status(200).json({message: "Deleted"});
      } else {
        return res.status(404).json({message: "Not found recipe"});
      }
    } catch (error) {
      return res.status(500).json({mesage: error});
    }
  }

  static async saveRecipe(req, res) {
    const { userId, title, description, ingredients, category } = req.body;
    const newRecipe = new Recipe({
      userId: userId,
      title: title,
      description: description,
      ingredients: ingredients,
      category: category,
    });
    try {
      await newRecipe.save();
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error while trying to post a new recipe", error });
    }
  }

  static async getRecipeByIdWithoutReq(id) {
      const recipe = await Recipe.findById(id);
      if (recipe) {
        return recipe;
      } else {
        return null;
      }
  }

  static async getRecipeById(req, res) {
    const id = req.params.id;
    try {
      const recipe = await Recipe.findById(id);
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ message: "Recipe not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server", error });
    }
  }
}

export default RecipeController;
