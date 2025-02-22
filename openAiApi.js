import { z } from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

dotenv.config(); 

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
const moods = ["Happy", "Sad", "Angry", "Chilled", "Reflective", "Fearful", "Disgusted"];

// Full schema for the recommendations.
const recommendSchema = z.object({
    age: z.number().nullable(),
    mood: z.enum(moods),
    genres: z.array(z.string()).optional(),
    filmRecommendations: z.array(visualMedia),
    tvRecommendations: z.array(visualMedia),
    bookRecommendations: z.array(writtenMedia),
    musicRecommendations: z.array(musicMedia)
});

export async function getRecommendation(client, z, zodResponseFormat) {
    // Test input. Will eventually be user input.
    const input = `I am 29 years old. I'm currently quite extatic. 
    In other news I have recently watched Hannibal with Mads Mikkelsen & Zone of Interest. I recently read Game of Thrones while
    listening to The Gaslight Anthem.`;

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

                    If any information is not available, return null or an empty array [] for that field. Do not leave any field missing from the JSON structure.
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

        // Return the validated data
        console.log("Valid Recommendations:", result.data);
        return result.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        return null;
    }
}

// Test the function
// getRecommendation(client, z, zodResponseFormat)
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
