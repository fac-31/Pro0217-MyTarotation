import dotenv from "dotenv";

dotenv.config();

export async function getFilm(recommend) {

    let film = recommend.filmRecommendations;

    let title = film[0].title.replace(/ /g, "+");
    
    try {
        let filmObject = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.MOVIE_API_KEY}`)
            .then(response => response.json());

        let returnObject = {
            title: filmObject.Title,
            plot: filmObject.Plot,
            genres: filmObject.Genre,
            art: filmObject.Poster
        };

        console.log(returnObject)

        return returnObject;

    } catch (error) {
        console.log("Error fetching Move details: " + error);
    };
}