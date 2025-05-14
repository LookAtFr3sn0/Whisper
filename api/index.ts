import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes/api.route.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = join(__dirname, 'public');
const app = express();
const port = 3000;

app
    .use(express.json())
    .use(cors())
    .use(cookieParser())
    .use('/api', apiRoutes)
    .use(express.static(staticPath));

app.get("/*splat", (req, res) => {
    res.sendFile(join(staticPath, "index.html"), (err) => {
        if (err) res.status(400).send("Error while loading the page").end();
    })
});

app.disable('x-powered-by');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
