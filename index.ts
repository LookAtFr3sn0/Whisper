import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = join(__dirname, 'public');
const app = express();
const port = process.env.PORT || 80;

app
    .use(express.json())
    .use(cors())
    .use(cookieParser())
    .use(express.static(staticPath));

app.get("/", (req, res) => {
    res.sendFile(join(staticPath, "index.html"), (err) => {
        if (err) res.status(400).send("Error while loading the page").end();
    })
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
