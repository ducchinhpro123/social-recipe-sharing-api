# Social Recipe Sharing Platform

A full-featured web application for sharing cooking recipes, built with Node.js, Express, MongoDB, and EJS templates.

## Features

- User authentication (register, login, logout)
- Create, view, edit, and delete recipes
- Save favorite recipes
- Browse and filter recipes by category, difficulty, and time
- Responsive design for desktop and mobile devices
- Sample data to demonstrate functionality

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templates, CSS, JavaScript
- **Authentication**: Session-based with bcrypt password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a remote connection string)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/social-recipe-sharing-api.git
   cd social-recipe-sharing-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/recipe-sharing
   SESSION_SECRET=your_session_secret_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. Download sample images and seed the database with initial data:
   ```
   npm run setup
   ```
   This command will:
   - Download placeholder images for recipes
   - Create sample users and recipes

## Running the Application

Setup
```
npm set up
```

Start the application in development mode:
```
npm run dev
```

Or in production mode:
```
npm start
```

The application will be available at `http://localhost:3001`

## Default User Accounts

After seeding the database, you can log in with these accounts:

1. **Regular User**
   - Username: chef_john
   - Email: john@example.com
   - Password: password123

2. **Regular User**
   - Username: cooking_master
   - Email: master@example.com
   - Password: password123

3. **Admin User**
   - Username: admin
   - Email: admin@example.com
   - Password: adminpassword

## Project Structure

```
social-recipe-sharing-api/
│
├── config/             # Configuration files
├── controllers/        # Controller logic
├── middleware/         # Custom middleware
├── model/              # Database models
├── models/             # Additional models
├── public/             # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side scripts
│   └── images/         # Images and uploads
├── route/              # Route definitions
├── scripts/            # Utility scripts
├── seed/               # Database seeding scripts
├── views/              # EJS templates
│   ├── auth/           # Authentication views
│   └── recipes/        # Recipe-related views
├── .env                # Environment variables (create this)
├── app.js              # Application entry point
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/:id` - Get user by ID
- GET `/api/users/` - Get all users
- POST `/api/users/favorites` - Add/remove recipe to favorites
- POST `/api/users/is-contains-favorites` - Check if recipe is in favorites
- POST `/api/users/get-favorites` - Get user's favorite recipes
- POST `/api/users/get-favorites-length` - Get number of favorite recipes

### Recipes
- POST `/api/recipes/` - Create a new recipe
- GET `/api/recipes` - Get all recipes
- GET `/api/recipes/:id` - Get recipe by ID
- GET `/api/recipes/delete/:id` - Delete recipe by ID
- POST `/api/recipes/update/` - Update recipe

### Admin API Endpoint
- POST `/api/admin/login` - Login admin user

## Deployment on Vercel

This application can be easily deployed on Vercel by following these steps:

1. Push your code to a GitHub repository
2. Create an account on [Vercel](https://vercel.com/)
3. Click "New Project" and select your GitHub repository
4. Configure the project:
   - Framework preset: Other
   - Root directory: ./
   - Build Command: npm run setup
   - Output directory: public
   - Install Command: npm install
5. Configure environment variables:
   - Add your `MONGODB_URI`, `SESSION_SECRET`, and `JWT_SECRET` 
6. Click "Deploy"

### Making Your Deployment Public

To ensure your deployment is publicly accessible:

1. Go to your project dashboard on Vercel
2. Click on "Settings" → "Authentication"
3. Turn off "Require Authentication" 
4. Under "Access" settings, select "Public"
5. Click "Save"
6. Redeploy your application

Now anyone can access your application without needing to log in to Vercel or GitHub.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [EJS](https://ejs.co/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- Unsplash for sample images
