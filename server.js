import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import zod from "zod";

import { zodResponseFormat } from "openai/helpers/zod";

import { getRecommendation } from "./Api's/openAiApi.js";
import { getBooks } from "./Api's/bookApi.js";
import { randomImage } from "./randomImage.js";
import { getFilm } from "./Api's/movieApi.js";

//console.log(await getFilm(object))

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.API_KEY
});

let object = await getRecommendation(client, zod, zodResponseFormat);

await getFilm(object);

await getBooks(object);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/fortune.html");
});

app.get("/new", (req, res) => {
	res.sendFile(__dirname + "/public/new-fortune.html");
});

app.get("/mood", (req, res) => {
	res.sendFile(__dirname + "/public/mood.html");
});

app.get('/get-image', async (req, res) => {
    const imageUrl = await randomImage();
    if (imageUrl) {
        res.json({ imageUrl });
    } else {
        res.status(404).json({ error: "No image found" });
    }
});



// console.log(await randomImage());
// console.log(await getRecommendation(client, zod, zodResponseFormat));
// console.log(await getBooks(getRecommendation(client, zod, zodResponseFormat)));
app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`)
});


