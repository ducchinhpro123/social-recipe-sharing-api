import express           from 'express';
import bodyParser        from 'body-parser';
import path              from 'path';
import { fileURLToPath } from 'url';

// Import models first to ensure they are registered in the correct order
import './models/User.js';  // First load the User model
import './model/models.js'; // Then load other models

import { router }         from './route/routes.js';
import { adminRouter }    from './route/route_admin.js';
import { connectMongoDB } from './config/config.js';
import session            from 'express-session';
import flash              from 'connect-flash';

const PORT = 3001;
const app = express();

connectMongoDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix the views directory path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
        secret: 'nothing',
        resave: false,
        saveUninitialized: true
}));
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

// Serve static files - fix the paths
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',      router);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
});

