import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

export const handleImageFallback = (req, res, next) => {
  // Only apply to image requests
  if (!req.path.startsWith('/images/')) {
    return next();
  }

  const imageName = req.path.replace('/images/', '');
  const imagePath = path.join(imagesDir, imageName);
  
  // Check if image exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If image doesn't exist, redirect to default image
      return res.redirect('/images/default-recipe.jpg');
    }
    next();
  });
};
