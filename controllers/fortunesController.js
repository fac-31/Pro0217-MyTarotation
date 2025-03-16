import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";
import { randomImage } from "../utils/randomImage.js";
import { 
    handleRecommendations, 
    matchMood 
} from "../apis/openAiApi.js";
import { 
    saveMoods,
    getCommonMood, 
    getRandomMoodFortune, 
    getRandom,
    saveFortune
} from "../storage.js";
import starsigns from "../lib/starsigns.js";
import { getMusic } from "../apis/musicApi.js";
import { getBook } from "../apis/bookApi.js";
import { getFilm } from "../apis/movieApi.js";

const __dirname = import.meta.dirname;









// res.renderWithLayout(generateCardLayout(recommendations), 
//             { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
//         );

