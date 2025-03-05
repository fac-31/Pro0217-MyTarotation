import { z } from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { getFilm } from "./movieApi.js";

import { getBook } from "./bookApi.js";
import { getMusic } from "./musicApi.js";


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
    tvRecommendations: z.array(visualMedia),
    bookRecommendations: z.array(writtenMedia),
    musicRecommendations: z.array(musicMedia)
});

export async function getRecommendation(client, z, zodResponseFormat, userInput) {
    // Test input. Will eventually be user input.

    const input = userInput || "I am 29 years old. I'm currently quite ecstatic. In other news, I have recently watched Hannibal with Mads Mikkelsen & Zone of Interest. I recently read Game of Thrones while listening to The Gaslight Anthem.";

    try {
        // Make the request to OpenAI to get recommendations
        let response = await client.chat.completions.create({
            model: "gpt-4o", 
            messages: [
                {
                    role: "system",
                    content: `
                    
                    You are an expert media critic. Based on the user's input, please recommend:
                    - 1 film
                    - 1 TV show
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

                    The recommendations should be presented with the following structure:

                    {
                      "mood": "<mood>",
                      "age": <age>,
                      "starsign": <starsign>,
                      "genres": <array_of_genres>,
                      "filmRecommendations": [{
                        "title": "<film_title>",
                        "genre": <array_of_genres>
                      }],
                      "tvRecommendations": [{
                        "title": "<tv_show_title>",
                        "genre": <array_of_genres>
                      }],
                      "bookRecommendations": [{
                        "title": "<book_title>",
                        "genre": <array_of_genres>,
                        "isbnCode": "<isbn_code>"
                      }],
                      "musicRecommendations": [{
                        "title": "<music_album_title>",
                        "artist": "<artist>",
                        "genre": <array_of_genres>
                      }]
                    }

                    If any information is not available, return null or an empty array [] for that field. Do not leave any field missing from the JSON structure. Do not recommend a piece of media that the user has mentioned.
                    Return the correct starsign if you are able to with the information provided, else return null. 
                    `,
                },
                {
                    role: "user",
                    content: input,
                },
            ],
            // Use the zodresponseformat & pass it the final schema with a title.
            response_format: zodResponseFormat(recommendSchema, "recommendations"),
        });

        // Parse the raw AI response
        const parsedData = response.choices[0].message.content;

        // Parse response into JSON
        let parsedJSON;
        try {
            parsedJSON = JSON.parse(parsedData);
        } catch (error) {
            throw new Error("AI response is not valid JSON.");
        }

        // Response validation via Zod schema
        const result = recommendSchema.safeParse(parsedJSON);

        if (!result.success) {
            console.error("Validation Error:", result.error);
            throw new Error("Invalid AI response format");
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        return null;
    }
}

const closestMoodSchema = z.object({
    closestMood: z.enum(moods)
});

export async function matchMood(userInput) {
    // Test input. Will eventually be user input.
    console.log("OpenAI Api Mood Match called");
    const input = userInput || "happy";

    try {
        // Make the request to OpenAI to get recommendations
        let response = await client.chat.completions.create({
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
        } catch (error) {
            throw new Error("AI response is not valid JSON.");
        }

        // Response validation via Zod schema
        const result = closestMoodSchema.safeParse(parsedJSON);

        if (!result.success) {
            console.error("Validation Error:", result.error);
            throw new Error("Invalid AI response format");
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        return null;
    }
}

//right now we don't use req, but we will need to change it when we will implement recommendations based on user input
export async function handleRecommendations(req, formattedInput) { 
    console.log('Formated input:', formattedInput)
    try {
        let aiResponse = await getRecommendation(client, z, zodResponseFormat, formattedInput);
        if (!aiResponse) throw new Error("No AI response received");


        let books = aiResponse.bookRecommendations
        ? await Promise.all([aiResponse.bookRecommendations].flat().map(getBook))
        : [];

        let movies = aiResponse.filmRecommendations
        ? await Promise.all([aiResponse.filmRecommendations].flat().map(getFilm))
        : [];

        let albums = aiResponse.musicRecommendations
        ? await Promise.all([aiResponse.musicRecommendations].flat().map(getMusic))
        : [];

        

        const recommendations = {
            books: books.filter(Boolean),
            movies: movies.filter(Boolean),
            albums: albums.filter(Boolean),
            mood: aiResponse.mood 
        };

        return recommendations; 

    } catch (error) {
        console.error("Error handling recommendations:", error);
        return null; 
    }
}



// Test the function
/*getRecommendation(client, z, zodResponseFormat)
    .then(data => console.log(data))
    .catch(error => console.error(error));
*/

/*
Here’s a breakdown of the APIs we’re considering for our app, along with their pros and cons:

1. TMDb (The Movie Database) API
 https://www.themoviedb.org/documentation/api

✅ Pros:

Free access with API key registration
Provides structured movie and TV show details, including genres and recommendations
Strong search functionality
⚠️ Cons:

Requires API key setup
Rate limits may apply for free tier usage
2. Books API Options
Option 1: Open Library API
https://openlibrary.org/search.json?q=the+lord+of+the+rings


✅ Pros:

Completely free and open-source
Simple to use, no API key required
⚠️ Cons:

No structured genre data (only loosely defined subjects)
Metadata can be inconsistent
Option 2: Google Books API
https://developers.google.com/books
Example for user interface and the data we can access: https://www.google.co.uk/books/edition/Robinson_Crusoe/j1BrBgAAQBAJ?hl=en&gbpv=0
Example: https://developers.google.com/books/docs/v1/using#ids


✅ Pros:

Free to use with an API key
Provides book titles, authors, genres, and ISBN codes
Strong search and metadata retrieval
⚠️ Cons:

Requires API key
Some rate limiting on free tier
🎯 Decision Point:

Do we need structured genre data? If yes, Google Books API is the better choice.
If genre data isn’t critical, Open Library API is simpler and fully open-source.
3. Music Album Data API Options

Option 1: Spotify API
Spotify API → https://developer.spotify.com/documentation/web-api

✅ Pros:

Provides album details, artist names, and genres
Strong search functionality
⚠️ Cons:

Requires a free developer account and authentication
Rate limits may apply

Option 2: MusicBrainz API
MusicBrainz API → https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2

✅ Pros:

Free and open-source
Provides structured music metadata, including genres
⚠️ Cons:

More complex to query compared to Spotify
Metadata may not be as rich as Spotify’s
🎯 Decision Point:

If we want an open-source solution, MusicBrainz API is the better fit.
If we prioritize better metadata and ease of use, Spotify API is stronger but requires authentication.


*/