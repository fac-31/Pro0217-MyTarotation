import express from 'express';
import 'dotenv/config'
const app = express();

import { router } from './routes/fortunesRoute.js';

const PORT = process.env.PORT || 3000;

app.use("/fortunes", router)

app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`)
});