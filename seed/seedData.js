import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { Recipe } from '../model/models.js';
import { connectMongoDB } from '../config/config.js';

// Connect to MongoDB
await connectMongoDB();

// Sample users data
const users = [
  {
    username: 'chef_john',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false
  },
  {
    username: 'cooking_master',
    email: 'master@example.com',
    password: 'password123',
    isAdmin: false
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpassword',
    isAdmin: true
  }
];

// Sample recipes data
const recipes = [
  {
    title: 'Classic Chocolate Chip Cookies',
    description: 'Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.',
    instructions: [
      'Preheat the oven to 375°F (190°C).',
      'In a large bowl, cream together the butter, white sugar, and brown sugar until smooth.',
      'Beat in the eggs one at a time, then stir in the vanilla.',
      'Combine flour, baking soda, and salt; gradually add to the creamed mixture.',
      'Fold in chocolate chips.',
      'Drop tablespoon-sized balls of dough onto ungreased baking sheets.',
      'Bake for 8 to 10 minutes or until edges are nicely browned.'
    ],
    prepTime: 20,
    cookTime: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Butter', amount: 1, unit: 'cup' },
      { name: 'White Sugar', amount: 1, unit: 'cup' },
      { name: 'Brown Sugar', amount: 1, unit: 'cup' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
      { name: 'Vanilla Extract', amount: 2, unit: 'teaspoons' },
      { name: 'All-purpose Flour', amount: 3, unit: 'cups' },
      { name: 'Baking Soda', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.5, unit: 'teaspoon' },
      { name: 'Chocolate Chips', amount: 2, unit: 'cups' }
    ],
    category: ['Dessert', 'Baking'],
    images: ['cookie1.jpg']
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
    instructions: [
      'Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente.',
      'Meanwhile, fry the pancetta in a large skillet until crispy.',
      'In a bowl, whisk together eggs, cheese, and pepper.',
      'Drain the pasta, reserving some cooking water.',
      'Quickly toss the hot pasta with the egg mixture and pancetta.',
      'Add cooking water as needed to create a creamy sauce.',
      'Serve immediately with extra cheese and black pepper.'
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Spaghetti', amount: 1, unit: 'pound' },
      { name: 'Eggs', amount: 3, unit: 'large' },
      { name: 'Pancetta', amount: 8, unit: 'ounces' },
      { name: 'Parmesan Cheese', amount: 1, unit: 'cup' },
      { name: 'Black Pepper', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 1, unit: 'teaspoon' }
    ],
    category: ['Pasta', 'Italian', 'Main Course'],
    images: ['carbonara.jpg']
  },
  {
    title: 'Fresh Garden Salad',
    description: 'A refreshing salad made with mixed greens and a variety of fresh vegetables.',
    instructions: [
      'Wash and dry all vegetables thoroughly.',
      'Tear the lettuce and place in a large salad bowl.',
      'Chop the remaining vegetables and add to the bowl.',
      'Make the dressing by whisking together olive oil, vinegar, mustard, salt, and pepper.',
      'Pour the dressing over the salad just before serving.',
      'Toss well and serve immediately.'
    ],
    prepTime: 15,
    cookTime: 0,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Mixed Greens', amount: 6, unit: 'cups' },
      { name: 'Cherry Tomatoes', amount: 1, unit: 'cup' },
      { name: 'Cucumber', amount: 1, unit: 'medium' },
      { name: 'Red Onion', amount: 0.5, unit: 'medium' },
      { name: 'Bell Pepper', amount: 1, unit: 'medium' },
      { name: 'Olive Oil', amount: 3, unit: 'tablespoons' },
      { name: 'Balsamic Vinegar', amount: 1, unit: 'tablespoon' },
      { name: 'Dijon Mustard', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Black Pepper', amount: 0.25, unit: 'teaspoon' }
    ],
    category: ['Salad', 'Vegetarian', 'Side Dish'],
    images: ['salad.jpg']
  },
  {
    title: 'Homemade Pizza',
    description: 'Delicious homemade pizza with your favorite toppings.',
    instructions: [
      'Preheat oven to 475°F (245°C).',
      'Roll out the pizza dough on a floured surface.',
      'Spread sauce evenly over the dough, leaving a small border for the crust.',
      'Sprinkle with cheese and add your favorite toppings.',
      'Transfer to a pizza stone or baking sheet.',
      'Bake for 12-15 minutes or until the crust is golden and cheese is bubbly.'
    ],
    prepTime: 30,
    cookTime: 15,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Pizza Dough', amount: 1, unit: 'pound' },
      { name: 'Tomato Sauce', amount: 0.5, unit: 'cup' },
      { name: 'Mozzarella Cheese', amount: 2, unit: 'cups' },
      { name: 'Pepperoni', amount: 4, unit: 'ounces' },
      { name: 'Bell Pepper', amount: 1, unit: 'medium' },
      { name: 'Mushrooms', amount: 8, unit: 'ounces' },
      { name: 'Olive Oil', amount: 1, unit: 'tablespoon' },
      { name: 'Italian Seasoning', amount: 1, unit: 'teaspoon' }
    ],
    category: ['Italian', 'Main Course'],
    images: ['pizza.jpg']
  }
];

// Function to seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create new users with hashed passwords
    const saltRounds = 10;
    const userPromises = users.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      return new User({
        ...user,
        password: hashedPassword
      }).save();
    });
    
    const createdUsers = await Promise.all(userPromises);
    console.log(`${createdUsers.length} users created`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Function to seed recipes
const seedRecipes = async (users) => {
  try {
    // Clear existing recipes
    await Recipe.deleteMany({});
    
    // Create new recipes with random user IDs
    const recipePromises = recipes.map(recipe => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return new Recipe({
        ...recipe,
        userId: randomUser._id
      }).save();
    });
    
    const createdRecipes = await Promise.all(recipePromises);
    console.log(`${createdRecipes.length} recipes created`);
    
    // Add some recipes to users' favorites
    for (const user of users) {
      // Add 1-3 random recipes to each user's favorites
      const numFavorites = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...createdRecipes].sort(() => 0.5 - Math.random());
      const selectedRecipes = shuffled.slice(0, numFavorites);
      
      user.favorites = selectedRecipes.map(recipe => recipe._id);
      await user.save();
    }
    console.log('Added favorites to users');
    
    return createdRecipes;
  } catch (error) {
    console.error('Error seeding recipes:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    const users = await seedUsers();
    await seedRecipes(users);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
