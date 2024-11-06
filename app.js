import express    from 'express';
import bodyParser from 'body-parser';

import { router }         from './route/routes.js';
import { connectMongoDB } from './config/config.js';

const PORT = 3000;
const app = express();

connectMongoDB();

app.use('/', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./public'));

app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
});

//const samples = [
//  {
//    username: "John_doe",
//    password: "123",
//    profileImage: "sample",
//    bio: "Food lover and home cook",
//    createdAt: new Date()
//  }
//];
//const sampleRecipes = [
//  {
//    userId: null,
//    title: "Spaghetti Carbonara",
//    description: "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
//    images: ["Some images"],
//    prepTime: 15,
//    cookTime: 20,
//    difficulty: "Medium",
//    ingredients: [
//      { name: "Spaghetti", amount: 200, unit: "g" },
//      { name: "Pancetta", amount: 100, unit: "g" },
//      { name: "Eggs", amount: 2, unit: "pcs" },
//      { name: "Parmesan cheese", amount: 50, unit: "g" },
//      { name: "Black pepper", amount: 1, unit: "tsp" }
//    ],
//    category: ["Italian", "Pasta"],
//    createdAt: new Date()
//  }
//]
//
//try {
//  const insertedUser = await User.insertMany(samples);
//  console.log("Inserted values: ", insertedUser);
//  sampleRecipes[0].userId = insertedUser[0]._id;
//
//  const insertedRecipe = await Recipe.insertMany(sampleRecipes);
//  console.log("Inserted Recipe");
//
//} catch (error) {
//  console.log("Error inserting sample data: ", error);
//}



