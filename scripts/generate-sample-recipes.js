import mongoose from 'mongoose';
import User from '../models/User.js';
import { Recipe } from '../model/models.js';
import { connectMongoDB } from '../config/config.js';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// Connect to MongoDB
await connectMongoDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Make sure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Sample recipe data with image URLs
const sampleRecipes = [
  {
    title: 'Creamy Mushroom Risotto',
    description: 'A rich and creamy Italian risotto with mushrooms, white wine, and Parmesan cheese.',
    instructions: [
      'Heat the broth in a saucepan and keep it warm.',
      'In a large pan, sauté onions in olive oil until translucent.',
      'Add mushrooms and cook until they release their moisture.',
      'Add the arborio rice and stir for 1-2 minutes until lightly toasted.',
      'Pour in white wine and stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly until absorbed before adding more.',
      'Continue until rice is creamy and al dente, about 18-20 minutes.',
      'Remove from heat and stir in butter and Parmesan cheese.',
      'Season with salt and pepper to taste.',
      'Let stand for 2 minutes before serving.'
    ],
    prepTime: 15,
    cookTime: 30,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Arborio Rice', amount: 1.5, unit: 'cups' },
      { name: 'Mushrooms', amount: 8, unit: 'oz' },
      { name: 'Chicken Broth', amount: 6, unit: 'cups' },
      { name: 'White Wine', amount: 0.5, unit: 'cup' },
      { name: 'Onion', amount: 1, unit: 'medium' },
      { name: 'Butter', amount: 2, unit: 'tablespoons' },
      { name: 'Parmesan Cheese', amount: 0.5, unit: 'cup' },
      { name: 'Olive Oil', amount: 2, unit: 'tablespoons' },
      { name: 'Salt', amount: 1, unit: 'teaspoon' },
      { name: 'Black Pepper', amount: 0.5, unit: 'teaspoon' }
    ],
    category: ['Italian', 'Main Course', 'Vegetarian'],
    image: {
      url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000',
      filename: 'mushroom-risotto.jpg'
    }
  },
  {
    title: 'Thai Green Curry',
    description: 'A fragrant and spicy Thai curry with coconut milk, vegetables, and your choice of protein.',
    instructions: [
      'Heat oil in a large pot over medium heat.',
      'Add green curry paste and stir until fragrant, about 1 minute.',
      'Pour in coconut milk and stir to combine.',
      'Add chicken or tofu and simmer for 5 minutes.',
      'Add vegetables and continue cooking for another 7-10 minutes until tender.',
      'Stir in fish sauce, sugar, and lime juice.',
      'Add thai basil leaves in the last minute of cooking.',
      'Serve hot with steamed jasmine rice.'
    ],
    prepTime: 20,
    cookTime: 25,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Green Curry Paste', amount: 2, unit: 'tablespoons' },
      { name: 'Coconut Milk', amount: 2, unit: 'cans' },
      { name: 'Chicken or Tofu', amount: 1, unit: 'pound' },
      { name: 'Bell Peppers', amount: 2, unit: 'medium' },
      { name: 'Bamboo Shoots', amount: 1, unit: 'cup' },
      { name: 'Fish Sauce', amount: 2, unit: 'tablespoons' },
      { name: 'Palm Sugar', amount: 1, unit: 'tablespoon' },
      { name: 'Lime Juice', amount: 2, unit: 'tablespoons' },
      { name: 'Thai Basil Leaves', amount: 1, unit: 'cup' },
      { name: 'Vegetable Oil', amount: 2, unit: 'tablespoons' }
    ],
    category: ['Thai', 'Main Course', 'Spicy'],
    image: {
      url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1000',
      filename: 'thai-green-curry.jpg'
    }
  },
  {
    title: 'Classic French Crepes',
    description: 'Thin and delicate French pancakes that can be filled with sweet or savory ingredients.',
    instructions: [
      'In a blender, combine all ingredients and blend until smooth.',
      'Refrigerate the batter for at least 1 hour.',
      'Heat a non-stick pan over medium heat and lightly butter it.',
      'Pour about 1/4 cup of batter into the center of the pan, then tilt to spread evenly.',
      'Cook until the bottom is light brown, about 2 minutes.',
      'Flip and cook the other side for about 1 minute.',
      'Transfer to a plate and repeat with remaining batter.',
      'Fill with desired sweet or savory fillings and serve.'
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: 'Medium',
    ingredients: [
      { name: 'All-purpose Flour', amount: 1, unit: 'cup' },
      { name: 'Eggs', amount: 2, unit: 'large' },
      { name: 'Milk', amount: 1.25, unit: 'cups' },
      { name: 'Water', amount: 0.25, unit: 'cup' },
      { name: 'Butter', amount: 2, unit: 'tablespoons' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Sugar', amount: 1, unit: 'tablespoon' },
      { name: 'Vanilla Extract', amount: 1, unit: 'teaspoon' }
    ],
    category: ['French', 'Breakfast', 'Dessert'],
    image: {
      url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=1000',
      filename: 'french-crepes.jpg'
    }
  },
  {
    title: 'Quinoa Salad with Roasted Vegetables',
    description: 'A healthy and colorful salad with protein-rich quinoa and a variety of roasted vegetables.',
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Toss vegetables with olive oil, salt, and pepper on a baking sheet.',
      'Roast vegetables for 20-25 minutes, stirring halfway through.',
      'Meanwhile, rinse quinoa thoroughly and cook according to package instructions.',
      'In a small bowl, whisk together lemon juice, olive oil, garlic, and herbs for the dressing.',
      'Combine cooked quinoa and roasted vegetables in a large bowl.',
      'Pour dressing over the salad and toss to combine.',
      'Add feta cheese and stir gently.',
      'Serve warm or at room temperature.'
    ],
    prepTime: 15,
    cookTime: 30,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'cup' },
      { name: 'Bell Peppers', amount: 2, unit: 'medium' },
      { name: 'Zucchini', amount: 1, unit: 'medium' },
      { name: 'Red Onion', amount: 1, unit: 'small' },
      { name: 'Cherry Tomatoes', amount: 1, unit: 'cup' },
      { name: 'Olive Oil', amount: 3, unit: 'tablespoons' },
      { name: 'Lemon Juice', amount: 2, unit: 'tablespoons' },
      { name: 'Feta Cheese', amount: 0.5, unit: 'cup' },
      { name: 'Fresh Herbs', amount: 0.25, unit: 'cup' },
      { name: 'Salt and Pepper', amount: 1, unit: 'to taste' }
    ],
    category: ['Vegetarian', 'Salad', 'Healthy'],
    image: {
      url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000',
      filename: 'quinoa-salad.jpg'
    }
  },
  {
    title: 'Beef and Broccoli Stir-Fry',
    description: 'A quick and flavorful Chinese stir-fry with tender beef and crisp broccoli in a savory sauce.',
    instructions: [
      'Slice beef thinly against the grain and marinate with soy sauce, cornstarch, and oil for 20 minutes.',
      'Mix sauce ingredients in a small bowl: soy sauce, oyster sauce, brown sugar, and cornstarch slurry.',
      'Heat oil in a wok or large skillet over high heat.',
      'Add beef in a single layer and sear for 1 minute per side. Remove and set aside.',
      'In the same wok, add garlic and ginger, stir for 30 seconds.',
      'Add broccoli and stir-fry for 3-4 minutes until bright green but still crisp.',
      'Return beef to the wok, add the sauce mixture and toss to combine.',
      'Cook until sauce thickens, about 1-2 minutes.',
      'Serve hot over steamed rice.'
    ],
    prepTime: 25,
    cookTime: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Flank Steak', amount: 1, unit: 'pound' },
      { name: 'Broccoli Florets', amount: 4, unit: 'cups' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Ginger', amount: 1, unit: 'tablespoon' },
      { name: 'Soy Sauce', amount: 3, unit: 'tablespoons' },
      { name: 'Oyster Sauce', amount: 2, unit: 'tablespoons' },
      { name: 'Brown Sugar', amount: 1, unit: 'tablespoon' },
      { name: 'Cornstarch', amount: 2, unit: 'teaspoons' },
      { name: 'Vegetable Oil', amount: 2, unit: 'tablespoons' },
      { name: 'Sesame Oil', amount: 1, unit: 'teaspoon' }
    ],
    category: ['Chinese', 'Main Course', 'Quick Meals'],
    image: {
      url: 'https://images.unsplash.com/photo-1627662168223-7df99068099a?q=80&w=1000',
      filename: 'beef-broccoli.jpg'
    }
  },
  {
    title: 'Homemade Sourdough Bread',
    description: 'A rustic loaf of sourdough bread with a crispy crust and chewy, tangy interior.',
    instructions: [
      'Mix starter, flour, water, and salt to form a shaggy dough.',
      'Let rest for 30 minutes (autolyse stage).',
      'Perform a series of stretch and folds every 30 minutes for 2-3 hours.',
      'Shape dough into a round boule and place in a floured banneton.',
      'Cover and refrigerate overnight (8-12 hours).',
      'The next day, preheat a Dutch oven in a 450°F (230°C) oven.',
      'Turn dough out onto parchment paper and score the top.',
      'Bake covered for 20 minutes, then uncovered for 20-25 minutes more.',
      'Cool completely on a wire rack before slicing.'
    ],
    prepTime: 30,
    cookTime: 45,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Sourdough Starter', amount: 100, unit: 'g' },
      { name: 'Bread Flour', amount: 400, unit: 'g' },
      { name: 'Water', amount: 275, unit: 'g' },
      { name: 'Salt', amount: 10, unit: 'g' }
    ],
    category: ['Baking', 'Bread'],
    image: {
      url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000',
      filename: 'sourdough-bread.jpg'
    }
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Tender chunks of chicken in a creamy, mildly spiced tomato-based curry sauce.',
    instructions: [
      'Marinate chicken in yogurt, lemon juice, and half the spices for at least 2 hours.',
      'Thread chicken onto skewers and grill or broil until charred on the edges.',
      'In a large pot, heat oil and sauté onions until golden brown.',
      'Add garlic, ginger, and remaining spices. Cook for 1 minute until fragrant.',
      'Add tomato sauce and bring to a simmer.',
      'Add grilled chicken and simmer for 10 minutes.',
      'Stir in cream and cook for another 5 minutes.',
      'Garnish with cilantro and serve with naan bread or rice.'
    ],
    prepTime: 30,
    cookTime: 30,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken Breast', amount: 1.5, unit: 'pounds' },
      { name: 'Plain Yogurt', amount: 1, unit: 'cup' },
      { name: 'Tomato Sauce', amount: 2, unit: 'cups' },
      { name: 'Heavy Cream', amount: 0.5, unit: 'cup' },
      { name: 'Onion', amount: 1, unit: 'large' },
      { name: 'Garlic', amount: 4, unit: 'cloves' },
      { name: 'Ginger', amount: 1, unit: 'tablespoon' },
      { name: 'Garam Masala', amount: 2, unit: 'tablespoons' },
      { name: 'Turmeric', amount: 1, unit: 'teaspoon' },
      { name: 'Cumin', amount: 1, unit: 'teaspoon' },
      { name: 'Paprika', amount: 1, unit: 'teaspoon' },
      { name: 'Cilantro', amount: 0.25, unit: 'cup' }
    ],
    category: ['Indian', 'Main Course', 'Spicy'],
    image: {
      url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
      filename: 'chicken-tikka-masala.jpg'
    }
  },
  {
    title: 'Avocado Toast with Poached Eggs',
    description: 'A trendy and nutritious breakfast featuring creamy avocado, perfectly poached eggs, and a variety of toppings.',
    instructions: [
      'Bring a pot of water to a gentle simmer and add vinegar.',
      'Crack each egg into a small bowl, then carefully slide into the simmering water.',
      'Poach eggs for 3-4 minutes for a runny yolk.',
      'Meanwhile, toast the bread slices until golden.',
      'Mash the avocado with lime juice, salt, and pepper.',
      'Spread the avocado mixture on the toast.',
      'Top with poached eggs, red pepper flakes, and other desired toppings.',
      'Season with salt and pepper to taste and serve immediately.'
    ],
    prepTime: 10,
    cookTime: 5,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Sourdough Bread', amount: 2, unit: 'slices' },
      { name: 'Ripe Avocado', amount: 1, unit: 'medium' },
      { name: 'Eggs', amount: 2, unit: 'large' },
      { name: 'Lime Juice', amount: 1, unit: 'teaspoon' },
      { name: 'Red Pepper Flakes', amount: 0.5, unit: 'teaspoon' },
      { name: 'White Vinegar', amount: 1, unit: 'tablespoon' },
      { name: 'Salt', amount: 0.25, unit: 'teaspoon' },
      { name: 'Black Pepper', amount: 0.25, unit: 'teaspoon' },
      { name: 'Microgreens', amount: 0.25, unit: 'cup' },
      { name: 'Cherry Tomatoes', amount: 0.5, unit: 'cup' }
    ],
    category: ['Breakfast', 'Vegetarian', 'Healthy'],
    image: {
      url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000',
      filename: 'avocado-toast.jpg'
    }
  },
  {
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten chocolate center, perfect for impressing guests.',
    instructions: [
      'Preheat oven to 425°F (220°C) and butter four ramekins.',
      'Melt chocolate and butter together in a double boiler.',
      'In a separate bowl, whisk eggs, egg yolks, and sugar until light and fluffy.',
      'Fold the chocolate mixture into the egg mixture.',
      'Gently fold in flour until just combined.',
      'Divide batter among the prepared ramekins.',
      'Bake for 12-14 minutes until edges are set but centers are still soft.',
      'Let cool for 1 minute, then run a knife around the edges and invert onto plates.',
      'Dust with powdered sugar and serve immediately with ice cream or berries.'
    ],
    prepTime: 15,
    cookTime: 14,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Dark Chocolate', amount: 6, unit: 'oz' },
      { name: 'Unsalted Butter', amount: 0.5, unit: 'cup' },
      { name: 'Eggs', amount: 2, unit: 'large' },
      { name: 'Egg Yolks', amount: 2, unit: 'large' },
      { name: 'Granulated Sugar', amount: 0.25, unit: 'cup' },
      { name: 'All-purpose Flour', amount: 2, unit: 'tablespoons' },
      { name: 'Powdered Sugar', amount: 1, unit: 'tablespoon' },
      { name: 'Vanilla Ice Cream', amount: 1, unit: 'scoop per serving' }
    ],
    category: ['Dessert', 'Chocolate', 'Baking'],
    image: {
      url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000',
      filename: 'chocolate-lava-cake.jpg'
    }
  },
  {
    title: 'Mediterranean Grilled Salmon',
    description: 'Succulent salmon fillets marinated in Mediterranean flavors and grilled to perfection.',
    instructions: [
      'In a bowl, mix olive oil, lemon juice, garlic, and herbs to make the marinade.',
      'Place salmon fillets in a shallow dish and pour marinade over them.',
      'Let marinate in the refrigerator for 30 minutes to 1 hour.',
      'Preheat grill to medium-high heat.',
      'Remove salmon from marinade and pat dry.',
      'Season with salt and pepper.',
      'Grill salmon skin-side down for 4-5 minutes.',
      'Carefully flip and grill for another 3-4 minutes until cooked through but still moist.',
      'Serve with lemon wedges and a side of Greek salad or roasted vegetables.'
    ],
    prepTime: 40,
    cookTime: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Salmon Fillets', amount: 1.5, unit: 'pounds' },
      { name: 'Olive Oil', amount: 0.25, unit: 'cup' },
      { name: 'Lemon Juice', amount: 2, unit: 'tablespoons' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Fresh Dill', amount: 2, unit: 'tablespoons' },
      { name: 'Oregano', amount: 1, unit: 'teaspoon' },
      { name: 'Salt', amount: 1, unit: 'teaspoon' },
      { name: 'Black Pepper', amount: 0.5, unit: 'teaspoon' },
      { name: 'Lemon Wedges', amount: 4, unit: 'for serving' }
    ],
    category: ['Seafood', 'Mediterranean', 'Healthy'],
    image: {
      url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000',
      filename: 'grilled-salmon.jpg'
    }
  }
];

// Function to download an image from URL
async function downloadImage(url, filename) {
  const filepath = path.join(imagesDir, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`${filename} already exists, skipping download...`);
    return filename;
  }
  
  console.log(`Downloading ${filename}...`);
  
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename} successfully`);
        resolve(filename);
      });
      
      fileStream.on('error', err => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

// Function to create the recipes
async function generateSampleRecipes() {
  try {
    // Get all users from the database
    const users = await User.find({});
    
    if (users.length === 0) {
      console.error('No users found in the database. Please run the seed script first.');
      return;
    }
    
    console.log(`Found ${users.length} users in the database.`);
    
    // Process each recipe
    for (const recipe of sampleRecipes) {
      try {
        // Download the recipe image
        const imageName = await downloadImage(recipe.image.url, recipe.image.filename);
        
        // Assign the recipe to a random user
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        // Create the recipe
        const newRecipe = new Recipe({
          userId: randomUser._id,
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients,
          category: recipe.category,
          images: [imageName]
        });
        
        // Save the recipe
        await newRecipe.save();
        console.log(`Created recipe: ${recipe.title}`);
        
        // 50% chance to add this recipe as a favorite for users
        for (const user of users) {
          if (Math.random() < 0.5) {
            if (!user.favorites) {
              user.favorites = [];
            }
            
            // Check if the recipe is already in favorites
            if (!user.favorites.includes(newRecipe._id)) {
              user.favorites.push(newRecipe._id);
              await user.save();
              console.log(`Added ${recipe.title} to ${user.username}'s favorites`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing recipe ${recipe.title}:`, error.message);
      }
    }
    
    console.log(`Successfully generated ${sampleRecipes.length} sample recipes.`);
  } catch (error) {
    console.error('Error generating sample recipes:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
generateSampleRecipes();
