import mongoose from "mongoose";
import User from "../models/User.js"; // Import the existing User model instead of redefining it

// Export the User model so it can be used elsewhere
export { User };

// Define the Recipe schema and model
const recipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: [String],
  images: [String],
  prepTime: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0 
  },
  cookTime: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0 
  },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard'] 
  },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }
  }],
  category: [String],
  createdAt: { type: Date, default: Date.now }
});

export const Recipe = mongoose.model("Recipe", recipeSchema);

// Define any other schemas and models as needed
// ...existing code...

