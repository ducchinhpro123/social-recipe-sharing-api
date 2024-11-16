import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_API;

export function connectMongoDB() {
  mongoose.connect(uri)
    .then(() => console.log("Connected to mongoose database"))
    .catch(error => console.log("Cannot connect to the database", error));
}


