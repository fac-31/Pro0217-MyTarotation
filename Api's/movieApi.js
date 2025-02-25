import dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

export async function getFilm(recommend) {

    let film = recommend.filmRecommendations;

    let title = film[0].title.replace(/ /g, "+");

    let filmSchema = z.object({
        title: z.string(),
        plot: z.string(),
        genres: z.array(z.string()),
        art: z.string()
    });
    
    try {

        let filmObject = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.MOVIE_API_KEY}`)
            .then(response => response.json());

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

        console.log("Valid Film:", result.data);

        return result.data;

    } catch (error) {

        console.log("Error fetching Film details: " + error);

    };
}