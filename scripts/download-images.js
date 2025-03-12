import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Make sure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Default image for recipes without an image
const defaultRecipeUrl = 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?q=80&w=1000';
downloadImage(defaultRecipeUrl, 'default-recipe.jpg');

// Sample recipe images
const imageUrls = [
  {
    url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000',
    filename: 'cookie1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?q=80&w=1000',
    filename: 'carbonara.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000',
    filename: 'salad.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000',
    filename: 'pizza.jpg'
  }
];

// Download all images
imageUrls.forEach(image => {
  downloadImage(image.url, image.filename);
});

function downloadImage(url, filename) {
  const filepath = path.join(imagesDir, filename);
  
  // Skip if the file already exists
  if (fs.existsSync(filepath)) {
    console.log(`${filename} already exists, skipping...`);
    return;
  }
  
  console.log(`Downloading ${filename}...`);
  
  https.get(url, response => {
    if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename} successfully`);
      });
    } else {
      console.error(`Failed to download ${filename}: ${response.statusCode} ${response.statusMessage}`);
    }
  }).on('error', err => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}
