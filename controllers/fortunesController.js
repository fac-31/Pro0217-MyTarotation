import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";

const __dirname = import.meta.dirname

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

export const getHomePage = async (req,res) => {
    res.sendFile(path.join(__dirname,"../public/fortune.html"))
}

export const getNewFortunePage = async (req,res) => {
    res.sendFile(path.join(__dirname,"../public/new-fortune.html"))
}

export const getMoodPage = async (req,res) => {
    res.sendFile(path.join(__dirname,"../public/mood.html"))
}

export const postNewFortune = async (req,res) => {
    res.send("New")
}

export const getMoodFortune = async (req,res) => {
    res.send(req.query.mood)
}

export const getRandomFortune = async (req,res) => {
    res.send("random")
}