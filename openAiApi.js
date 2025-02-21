import { z } from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); 

const openai = new OpenAI({
  apiKey: process.env.API_KEY, 
});

const recommendSchema = z.object({
    age: z.number().nullable(),
    mood: z.string(),
    genres: z.array(z.string()).optional(),
    filmRecommendations: z.array(
      z.object({
        title: z.string(),
        genre: z.array(z.string())
      })
    ),
    tvRecommendations: z.array(
      z.object({
        title: z.string(),
        genre: z.array(z.string())
      })
    ),
    bookRecommendations: z.array(
      z.object({
        title: z.string(),
        genre: z.array(z.string()),
        author: z.string().optional(),
        isbnCode: z.string()
      })
    ),
    musicRecommendations: z.array(
      z.object({
        title: z.string(),
        artist: z.string(),
        genre: z.array(z.string())
      })
    )
  });
  
  async function getRecommendations(input) {
    try {
      let response = await openai.chat.completions.create({
        model: "gpt-4",  
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
  
             The recommendations should be presented with the following structure:
  
             {
               "mood": "<mood>",               // A single word representing the user's mood
               "age": <age>,                   // The age of the user (if known, otherwise null)
               "genres": <array_of_genres>,    // An array of genres related to the user's preferences
               "filmRecommendations": [{       // An array of film recommendations
                 "title": "<film_title>",      // The title of the film
                 "genre": <array_of_genres>   // An array of genres related to the film
               }],
               "tvRecommendations": [{         // An array of TV show recommendations
                 "title": "<tv_show_title>",   // The title of the TV show
                 "genre": <array_of_genres>   // An array of genres related to the TV show
               }],
               "bookRecommendations": [{       // An array of book recommendations
                 "title": "<book_title>",      // The title of the book
                 "genre": <array_of_genres>,  // An array of genres related to the book
                 "isbnCode": "<isbn_code>"    // Include ISBN code for the book
               }],
               "musicRecommendations": [{      // An array of music recommendations
                 "title": "<music_album_title>", // The title of the album
                 "artist": "<artist>",           // The artist of the album
                 "genre": <array_of_genres>     // An array of genres related to the music
               }]
             }
  
             If any information is not available (such as age or genre), return null or an empty array [] for that field. Do not leave any field missing from the JSON structure.
            `,
          },
          {
            role: "user",
            content: input,
          },
        ],
      });
  
      console.log("Raw AI Response:", response.choices[0].message.content);
  
      const parsedData = response.choices[0].message.content;
      
      let parsedJSON;
      try {
        parsedJSON = JSON.parse(parsedData);
      } catch (error) {
        throw new Error("AI response is not valid JSON.");
      }
  
      // response validation via zod schema
      const result = recommendSchema.safeParse(parsedJSON);
  
      if (!result.success) {
        console.error("Validation Error:", result.error);
        throw new Error("Invalid AI response format");
      }
  
      console.log("Valid Recommendations:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
      return null;
    }
  }
  

  getRecommendations("I am 29 years old. I'm currently quite melancholic. In other news I have recently watched Hannibal with Mads Mikkelsen & Zone of Interest. I recently read Game of Thrones while listening to The Gaslight Anthem.")
    .then(data => console.log(data))
    .catch(error => console.error(error));
  