import { getBook } from "../apis/bookApi.js";
import { getMusic } from "../apis/musicApi.js";
import { getFilm } from "../apis/movieApi.js";
import { generateCardLayout } from "../utils/generateCardLayout.js";

// This file can be deleted once all layout tests are completed



export const testRecs  = async (req, res) => {
    const book = await getBook({isbnCode:"978-0307387899"})
    const album = await getMusic({title:'Rage Against the Machine',artist:'Rage Against the Machine'});
    const movie = await getFilm({title:"Mad Max: Fury Road"})
    const _id = "f008a9ce-dd74-4796-9264-c58e5c6c64f5"
    const recommendations = {
        books: [book],
        albums: [album],
        movies: [movie]
    }
    res.renderWithLayout(await generateCardLayout(recommendations, _id), 
        { title: "Your Fortune", nav: true, fortuneTellerImg: 'fadein' }
    );
}
// Get unlocked via id. Get class - this has space seperated list of unlocked. Split via space. Pass this to a refacted openAi call. 
// Get just that item. Reload that element. Will have to check styling and animations
