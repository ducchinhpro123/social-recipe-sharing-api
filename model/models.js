import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: String,
  password: String,
  profileImage: String,
  bio: String,
  //followers: [ObjectId],
  //following: [ObjectId],
  //savedRecipes: [ObjectId],
  createdAt: { type: Date, default: Date.now }
});

const recipe = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  title: String,
  description: String,
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
  //ratings: [{
  //  userId: ObjectId,
  //  rating: Number,
  //  review: String,
  //  date: Date
  //}],
  //likes: [ObjectId],
  //comments: [{
  //  userId: ObjectId,
  //  text: String,
  //  date: Date
  //}],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', user);
export const Recipe = mongoose.model('Recipe', recipe);

