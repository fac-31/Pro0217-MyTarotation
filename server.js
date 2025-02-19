import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

import zod from "zod";

import { zodResponseFormat } from "openai/helpers/zod";

import { getRecommendation } from "./openAiApi.js";
import { getBooks } from "./bookApi.js";

const client = new OpenAI({
    apiKey: process.env.API_KEY
});

getBooks(getRecommendation(client, zod, zodResponseFormat));

app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`)
});