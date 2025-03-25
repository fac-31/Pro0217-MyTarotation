var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";
dotenv.config({ path: path.resolve("../.env") });
export function getFilm(recommend) {
    return __awaiter(this, void 0, void 0, function* () {
        let film = recommend;
        let title = film.title.replace(/ /g, "+");
        let filmSchema = z.object({
            title: z.string(),
            plot: z.string(),
            genres: z.array(z.string()),
            art: z.string()
        });
        try {
            const response = yield fetch(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.MOVIE_API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            let filmObject = yield response.json();
            if (!filmObject || filmObject.Response === "False") {
                console.error("OMDB API Error:", filmObject.Error || "Unknown error");
                return null;
            }
            let returnObject = {
                title: filmObject.Title,
                plot: filmObject.Plot,
                genres: filmObject.Genre.split(", ").map(genre => genre.toLowerCase()),
                art: filmObject.Poster
            };
            const result = filmSchema.safeParse(returnObject);
            if (!result.success) {
                console.error("Validation Error:", result.error);
                throw new Error("Invalid filmApi response format");
            }
            ;
            return result.data;
        }
        catch (error) {
            console.log("Error fetching Film details: " + error);
        }
        ;
    });
}
