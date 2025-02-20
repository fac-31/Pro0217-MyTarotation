import express from "express";

const app = express();

import { router } from './routes/fortunesRoute.js';

const PORT = process.env.PORT || 3000;

import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

import zod from "zod";

import { zodResponseFormat } from "openai/helpers/zod";

import { getRecommendation } from "./openAiApi.js";
import { getBooks } from "./bookApi.js";
import { randomImage } from "./randomImage.js";

const client = new OpenAI({
    apiKey: process.env.API_KEY
});

// console.log(await randomImage());
// console.log(await getRecommendation(client, zod, zodResponseFormat));
// console.log(await getBooks(getRecommendation(client, zod, zodResponseFormat)));
app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`)
});