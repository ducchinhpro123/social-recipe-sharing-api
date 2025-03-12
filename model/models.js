import mongoose from "mongoose";
import User from "../models/User.js"; // Import the existing User model instead of redefining it

// Export the User model so it can be used elsewhere
export { User };

// Define the Recipe schema and model
const recipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: String,
  description: String,
  instructions: [String],
  images: [String],
  prepTime: Number,
  cookTime: Number,
  difficulty: String,
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }],
  category: [String],
  createdAt: { type: Date, default: Date.now }
});

export const Recipe = mongoose.model("Recipe", recipeSchema);

// Define any other schemas and models as needed
// ...existing code...

