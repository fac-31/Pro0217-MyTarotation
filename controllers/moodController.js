import { matchMood } from "../apis/openAiApi.js";
import { getRandomMoodFortune } from "../storage.js";
import { generateCardLayout } from "../utils/generateCardLayout.js";


// Renders Mood Select Page
export const getMoodPage = async (req,res) => {
    res.renderWithLayout(`
        <div class="flex items-center justify-center mt-6">
            <form 
                action="/mood" 
                method="get"
                class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 
                 border border-yellow-600 text-yellow-100
                 rounded-xl shadow-xl p-6 w-11/12 max-w-2xl">
                <h2 class="text-2xl font-bold mb-4 text-center">
                How you doing?
                </h2>
                <div class = "mt-6">
                    <input type="text" id="mood" name="mood" class="bg-purple-800 border border-yellow-500 text-yellow-100
                            placeholder-yellow-300 rounded-md p-3
                            focus:outline-none focus:ring-2 focus:ring-yellow-300
                            w-full" required placeholder = "I'm feeling...">
                </div>
                <div class = "mt-6 flex justify-center">
                    <button id="submit-form" class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700
                            border border-yellow-300 text-yellow-100 
                            px-8 py-3 rounded-lg text-lg font-semibold 
                            shadow-md transform transition-transform duration-300
                            hover:-translate-y-1 hover:shadow-2xl">Get Fortune</button>
                </div>
            </form>
        </div>
        <script src="./scripts/mood-select.js"></script>
    `, { title: "Fortune Teller - Mood", nav: true });
}

// Sends Selected Fortune data and Renders Fortune Told Page
export const getMoodFortune = async (req, res) => {
    // check moods - against pre-pop. In error handling - direct to newFortune page, if they want, if its not found.
    try {
        let requestMsg = req.params.mood || req.query.mood;

        if (req.query.mood) {
            const matchMoodAIresponse = await matchMood(requestMsg);
            requestMsg = matchMoodAIresponse.closestMood;
            // console.log("Matched Mood:", requestMsg);
        }

        let fortune = await getRandomMoodFortune(requestMsg);

        if (!fortune) {
            return res.renderWithLayout(`
                <div class="flex flex-col items-center justify-start gap-8 h-full w-full p-4">
                <div class="flex flex-col items-center justify-evenly">
                <h1 class="text-red-500">Sorry, I have no fortunes available for this mood!</h1>
                <p class="text-red-500">Would you like to create a new fortune or receive a random fortune?</p>
                </div>
                <div flex flex-row items-between justify-evenly> 
                <a href="/new" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">A New Fortune please!</a>
                <a href="/random" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">A Random Fortune please!</a>
                </div>
                </div>
                `, { title: "Mood Fortune" });
        }

        // Extract recommendations
        const recommendations = {
            movies: fortune.films ? [{ title: fortune.films.title, art: fortune.films.art, genres: fortune.films.genres, plot: fortune.films.plot }] : [],
            books: fortune.books ? [{ title: fortune.books.title, art: fortune.books.art, genres: fortune.books.genres, description: fortune.books.description }] : [],
            albums: fortune.albums ? [{ title: fortune.albums.title, artist: fortune.albums.artist, genres: fortune.albums.genres, art: fortune.albums.art }] : []
        };

        const _id = fortune._id;

        console.log(_id);

        res.renderWithLayout(await generateCardLayout(recommendations, _id), { 
            title: `Your Fortune - ${requestMsg}`, 
            nav: true, 
            fortuneTellerImg: 'success' 
        });

    } catch (error) {
        console.error("Error fetching mood-based fortune:", error);
        res.status(500).json({ error: "Error retrieving fortune" });
    }
};
