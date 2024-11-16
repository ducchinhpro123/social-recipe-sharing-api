import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: String,
  password: String,
  profileImage: String,
  bio: String,
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe'}],
  createdAt: { type: Date, default: Date.now }
  //followers: [ObjectId],
  //following: [ObjectId],
  //savedRecipes: [ObjectId],
});

const recipe = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
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
  // ratings: [{
  //  userId: ObjectId,
  //  isFavorite: Boolean,
  //  review: String,
  //  // date: Date
  // }],
  // likes: Number,
  //comments: [{
  //  userId: ObjectId,
  //  text: String,
  //  date: Date
  //}],
});

export const User = mongoose.model('User', user);
export const Recipe = mongoose.model('Recipe', recipe);

