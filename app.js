import express           from 'express';
import bodyParser        from 'body-parser';
import path              from 'path';
import { fileURLToPath } from 'url';

import { router }         from './route/routes.js';
import { connectMongoDB } from './config/config.js';

const PORT = 3001;
const app = express();

connectMongoDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/public/images/', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static('./public'));

app.use('/', router);

app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
});

