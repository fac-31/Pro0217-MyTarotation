import express from "express";
import "dotenv/config";

// App and PORT Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Import Routers
import { router as fortuneRouter } from './routes/fortunesRoute.js';

// Import Other Functions
import { randomImage } from "./randomImage.js";
import { getFilm } from "./Api's/movieApi.js";


app.use(express.json());
app.use(express.static("public"));

// Use Routers
app.use("/fortunes", fortuneRouter);

app.get('/get-image', async (req, res) => {
    const imageUrl = await randomImage();
    if (imageUrl) {
        res.json({ imageUrl });
    } else {
        res.status(404).json({ error: "No image found" });
    }
});


// TEST FUNCTIONS
// console.log(await randomImage());
// console.log(await getRecommendation(client, zod, zodResponseFormat));
// console.log(await getBooks(getRecommendation(client, zod, zodResponseFormat)));

// Run HTTP Server
app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`)
});


