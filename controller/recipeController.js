import {Recipe} from '../model/models.js';


export const saveRecipe = async (req, res) => {
  const { userId, title, description, ingredients, category } = req.body;
  const newRecipe = new Recipe({
    userId: userId,
    title: title, description: description, ingredients: ingredients, category: category,
  });
  try {
    newRecipe.save();
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error while trying to post a new recipe", error });
  }
};

export const getAllRecipes = async (_req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(201).json(recipes);
  } catch (error) {
    res.status(500).json({message: error});
  }
};

export const getRecipeById = async (req, res) => {
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
};

