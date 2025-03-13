import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = [
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', 'public', 'images'),
  path.join(__dirname, '..', 'public', 'css'),
  path.join(__dirname, '..', 'public', 'js'),
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory exists: ${dir}`);
  }
});

// Create an empty default-recipe.jpg if it doesn't exist
const defaultImagePath = path.join(__dirname, '..', 'public', 'images', 'default-recipe.jpg');
if (!fs.existsSync(defaultImagePath)) {
  console.log('Creating a placeholder default image...');
  // Copy a basic placeholder image from another location if available
  // Otherwise create an empty file as placeholder
  fs.writeFileSync(defaultImagePath, '');
  console.log(`Created placeholder at: ${defaultImagePath}`);
}

console.log('Directory check complete.');
