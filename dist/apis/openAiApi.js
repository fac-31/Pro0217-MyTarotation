var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { getFilm } from "./movieApi.js";
import { getBook } from "./bookApi.js";
import { getMusic } from "./musicApi.js";
import asdfjkl from 'asdfjkl';
import { zodResponseFormat } from "openai/helpers/zod.mjs";
dotenv.config({ path: path.resolve("../.env") });
const client = new OpenAI({
    apiKey: process.env.API_KEY,
});
// Zod object for visual media.
const visualMedia = z.object({
    title: z.string(),
    genre: z.array(z.string())
});
// Zod object for written media.
const writtenMedia = z.object({
    title: z.string(),
    genre: z.array(z.string()),
    author: z.string().optional(),
    isbnCode: z.string()
});
// Zod object for musical media.
const musicMedia = z.object({
    title: z.string(),
    artist: z.string(),
    genre: z.array(z.string())
});
// Array of moods to match against.
const moods = ["happy", "sad", "angry", "chilled", "reflective", "fearful", "disgusted"];
// Full schema for the recommendations.
const recommendSchema = z.object({
    age: z.number().nullable(),
    mood: z.enum(moods),
    starsign: z.string(),
    genres: z.array(z.string()).optional(),
    filmRecommendations: z.array(visualMedia),
    bookRecommendations: z.array(writtenMedia),
    musicRecommendations: z.array(musicMedia)
});
const refreshSchema = z.object({
    filmRecommendations: z.array(visualMedia),
    bookRecommendations: z.array(writtenMedia),
    musicRecommendations: z.array(musicMedia)
});
export function getRecommendation(client_1, z_1, zodResponseFormat_1, userInput_1) {
    return __awaiter(this, arguments, void 0, function* (client, z, zodResponseFormat, userInput, refreshInput = null, refreshType = null) {
        let formattedInput;
        let systemInput;
        let schema;
        let warningMessage = "";
        if (userInput) {
            let { age, mood, interests } = userInput;
            formattedInput = `I am ${age} years old. I'm currently feeling ${mood}. My interests are ${interests}.`;
            systemInput = `
    You are an expert media critic. Based on the user's input, please recommend:
    - 1 film
    - 1 book
    - 1 music album

    The recommendations should be:
    - Aligned with the user's mood (e.g., based on their emotional state).
    - The mood should be a **single word** that describes their current emotional state (e.g., "reflective", "energetic", "melancholic").
    - Each book recommendation should include an **ISBN code** to identify the specific edition of the book.

    If the user's mood is expressed in an unconventional way (e.g., "meh", "blah"), map it to one of the predefined moods:
    - "meh", "blah" → "Chilled"
    - "down", "sad" → "Sad"
    - "melancholic", "pensive" → "Reflective"

    If any information is not available, return null or an empty array [] for that field.
    Do not leave any field missing from the JSON structure. Do not recommend a piece of media that the user has mentioned.
    Return the correct starsign if you are able to with the information provided, else return null. 
   If gibberish was detected, add a note: "Your input was unclear, so we based recommendations on a 'happy' mood with popular entertainment." 
    `;
            schema = recommendSchema;
            if (asdfjkl.default(mood)) {
                console.warn("Detected gibberish mood. Using fallback.");
                mood = "happy";
                warningMessage += "Your mood input was unclear, so we assumed 'happy'. ";
            }
            ;
            if (asdfjkl.default(interests)) {
                console.warn('"Detected gibberish interests. Using fallback."');
                interests = "Thriller by Michael Jackson, Inception, The Great Gatsby";
                warningMessage += "Your interests input was unclear, so we used 'Thriller by Michael Jackson, Inception, The Great Gatsby' instead. ";
            }
            ;
        }
        else if (refreshInput.length > 0) {
            formattedInput = `I am not interested in the following pieces of media; ${refreshInput}. 
        Please make sure to recommend media for the following types, ${refreshType}. The recommendations should follow the same 
        type of genre and feel of the pieces of media I didn't want. I only want one recommendation per type of media and it cannot be
        one I have mentioned. If you recommend a book, please provide an ISBN code.`;
            systemInput = `You are an expert media critic. You must provide a recommendation for each type of media based on the users
        input. Suggest media that is similiar in nature, genre and feel to the items listed in their input. Only provide one recommendation
        per type of media. Make sure to provide an ISBN code for any written media`;
            schema = refreshSchema;
        }
        ;
        try {
            // Make the request to OpenAI to get recommendations
            let response = yield client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: systemInput,
                    },
                    {
                        role: "user",
                        content: formattedInput,
                    },
                ],
                // Use the zodresponseformat & pass it the final schema with a title.
                response_format: zodResponseFormat(schema, "recommendations"),
            });
            // Parse the raw AI response
            const parsedData = response.choices[0].message.content;
            // Parse response into JSON
            let parsedJSON;
            try {
                parsedJSON = JSON.parse(parsedData);
            }
            catch (error) {
                throw new Error("AI response is not valid JSON.");
            }
            // Response validation via Zod schema
            const result = schema.safeParse(parsedJSON);
            if (!result.success) {
                console.error("Validation Error:", result.error);
                throw new Error("Invalid AI response format");
            }
            return Object.assign(Object.assign({}, result.data), { warning: warningMessage });
        }
        catch (error) {
            console.error("Error fetching recommendations:", error.message);
            return null;
        }
    });
}
const closestMoodSchema = z.object({
    closestMood: z.enum(moods)
});
export function matchMood(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        // Test input. Will eventually be user input.
        const input = userInput || "happy";
        try {
            // Make the request to OpenAI to get recommendations
            let response = yield client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `
                    You need to match the user's inputed mood to the closest one of these predefined moods: ${moods.join(", ")}
                    `,
                    },
                    {
                        role: "user",
                        content: input,
                    },
                ],
                // Use the zodresponseformat & pass it the final schema with a title.
                response_format: zodResponseFormat(closestMoodSchema, "closestMood"),
            });
            // Parse the raw AI response
            const parsedData = response.choices[0].message.content;
            // Parse response into JSON
            let parsedJSON;
            try {
                parsedJSON = JSON.parse(parsedData);
            }
            catch (error) {
                throw new Error("AI response is not valid JSON.");
            }
            // Response validation via Zod schema
            const result = closestMoodSchema.safeParse(parsedJSON);
            if (!result.success) {
                console.error("Validation Error:", result.error);
                throw new Error("Invalid AI response format");
            }
            return result.data;
        }
        catch (error) {
            console.error("Error fetching recommendations:", error.message);
            return null;
        }
    });
}
//right now we don't use req, but we will need to change it when we will implement recommendations based on user input
export function handleRecommendations(req, input, refreshInput, refreshType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let aiResponse = yield getRecommendation(client, z, zodResponseFormat, input, refreshInput, refreshType);
            if (!aiResponse)
                throw new Error("No AI response received");
            console.log('AI Response:', aiResponse);
            let books = aiResponse.bookRecommendations
                ? yield Promise.all([aiResponse.bookRecommendations].flat().map(getBook))
                : [];
            let movies = aiResponse.filmRecommendations
                ? yield Promise.all([aiResponse.filmRecommendations].flat().map(getFilm))
                : [];
            let albums = aiResponse.musicRecommendations
                ? yield Promise.all([aiResponse.musicRecommendations].flat().map(getMusic))
                : [];
            const recommendations = {
                books: books.filter(Boolean),
                movies: movies.filter(Boolean),
                albums: albums.filter(Boolean),
                mood: aiResponse.mood,
                warning: aiResponse.warning
            };
            return recommendations;
        }
        catch (error) {
            console.error("Error handling recommendations:", error);
            return null;
        }
    });
}
