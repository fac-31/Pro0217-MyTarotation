import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve("../.env") });

export async function getFilm(recommend) {

    let film = recommend

    let title = film.title.replace(/ /g, "+");

    let filmSchema = z.object({
        title: z.string(),
        plot: z.string(),
        genres: z.array(z.string()),
        art: z.string()
    });
    
    try {

        const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.MOVIE_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        let filmObject = await response.json()
            if (!filmObject || filmObject.Response === "False") {
                console.error("OMDB API Error:", filmObject.Error || "Unknown error");
                return null;
            }
            
        let returnObject = {
            title: filmObject.Title,
            plot: filmObject.Plot,
            genres: filmObject.Genre.split(" "),
            art: filmObject.Poster
        };

        const result = filmSchema.safeParse(returnObject);

        if (!result.success) {

            console.error("Validation Error:", result.error);

            throw new Error("Invalid filmApi response format");

        };

        //console.log("Valid Film:", result.data);

        return result.data;

    } catch (error) {

        console.log("Error fetching Film details: " + error);

    };
}