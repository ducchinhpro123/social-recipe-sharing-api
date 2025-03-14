import express           from 'express';
import bodyParser        from 'body-parser';
import path              from 'path';
import { fileURLToPath } from 'url';
import cors              from 'cors';

// Import models first to ensure they are registered in the correct order
import './models/User.js';  // First load the User model
import './model/models.js'; // Then load other models

import { router }         from './route/routes.js';
import { adminRouter }    from './route/route_admin.js';
import { connectMongoDB } from './config/config.js';
import session            from 'express-session';
import flash              from 'connect-flash';
import { handleImageFallback } from './middleware/image-handler.js';

const PORT = process.env.PORT || 3001;
const app = express();

connectMongoDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix the views directory path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'nothing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// or, for specific origins
app.use(cors({
  origin: '*' // Replace with your Flutter app's origin
}));

// Improved static file serving configuration
// Make public directory and images directly accessible
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Add image fallback middleware
app.use(handleImageFallback);

// Routes
app.use('/', router);
app.use('/admin', adminRouter);

// Add global error handler
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    user: req.session.user || null
  });
});

// Add 404 handler for all unmatched routes
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The requested page does not exist.',
    user: req.session.user || null
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
