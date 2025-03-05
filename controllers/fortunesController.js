import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";
import { handleRecommendations } from "../apis/openAiApi.js";
import { saveMoods, getCommonMood, getRandomMoodFortune, saveFortune} from "../storage.js";

const __dirname = import.meta.dirname;

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Renders Home Page
export const getHomePage = async (req, res) => {
    let mood = await getCommonMood() + "";
    res.renderWithLayout(`
        <div class="relative flex flex-col items-center">
            <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
                <img src="" alt="" id="fortuneteller-img">
            </div>
            <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
                <p class="text-red-500 text-sm">What do you want to know?</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-6 mt-10">
            <a href="/new" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">New Fortune</a>
            <a href="/random" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Random</a>
            <a href="/mood" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Mood Select</a>
            <a href="" id="common-mood" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg"></a>
            <a href="/run-api" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Run API</a>
        </div>
        <script>
        function commonMoodButton () {
        let route =  "/mood/${mood}";
        let link = document.getElementById("common-mood")
        link.href = route;
        link.innerText = "Everyone's feeling ${mood} today"
    }
        window.onload = commonMoodButton;
        </script>
    `, { title: "Fortune Teller Home" });
}

// Renders New Fortune Page
export const getNewFortunePage = async (req,res) => {
    res.renderWithLayout(`
        <div class="relative flex flex-col items-center">
            <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
                <img src="" alt="" id="fortuneteller-img">
            </div>
            <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
                <p class="text-red-500 text-sm">Tell me about yourself</p>
            </div>
        </div>
        <form id="fortune-form" action="/new" method="post">
            <div class="grid grid-cols-3 gap-6 mt-6 w-3/4 max-w-2xl">
                <div class="flex flex-col">
                    <label for="name" class="font-semibold">Name</label>
                    <input id="name" name="name" type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
                <div class="flex flex-col">
                    <label for="age" class="font-semibold">Age</label>
                    <input id="age" name="age" type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
                <div class="flex flex-col">
                    <label for="mood" class="font-semibold">Current Mood</label>
                    <input id="mood" name="mood" type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
            </div>
            <div class="mt-6 w-3/4 max-w-2xl">
                <label for="interests" class="block font-semibold">Have you watched anything decent lately?</label>
                <textarea id="interests" name="interests" class="w-full border border-gray-400 p-3 rounded h-24"></textarea>
            </div>
            <div class="mt-6">
                <button class="border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg">See my future</button>
            </div> 
        </form>

        <div id="fortune-result" class="mt-8 w-3/4 max-w-2xl mx-auto hidden">
        </div>

    `, { title: "Fortune Teller - About You", nav: true });
}


// Renders Mood Select Page
export const getMoodPage = async (req,res) => {
    res.renderWithLayout(`
        <div class="relative flex flex-col items-center">
            <div class="w-40 h-40 flex items-center justify-center border-4 border-red-500 rounded-lg">
                <img src="" alt="" id="fortuneteller-img">
            </div>
            <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
                <p class="text-red-500 text-sm">How are you feeling?</p>
            </div>
        </div>
        <form class="flex flex-col items-center mt-6" action="/fortunes/mood" method="get">
            <label for="mood" class="text-black mb-2">Mood</label>
            <input type="text" id="mood" name="mood" class="border border-black px-4 py-2 rounded-md">
            <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg mt-6">Get Fortune</button>
        </form>
    `, { title: "Fortune Teller - Mood", nav: true });
}

// TODO: Handles new fortune post request 
// export const postNewFortune = async (req,res) => {
//     console.log ("form submit")
//     console.log(req.body);
//     res.send("Awaiting fortune");

//     document.getElementById("fortune-result").innerHTML = 
//         `<div>
//             <h3>Your Fortune:</h3>
//             <p><strong>Recommended Movie:</strong> ${data.filmRecommendations.title || "N/A"}</p>
//             <p><strong>Recommended TV Show:</strong> ${data.tvRecommendations.title || "N/A"}</p>
//             <p><strong>Recommended Book:</strong> ${data.bookRecommendations.title || "N/A"} (ISBN: ${data.bookRecommendations.isbnCode || "N/A"})</p>
//             <p><strong>Recommended Music:</strong> ${data.musicRecommendations.title || "N/A"} by ${data.musicRecommendations.artist || "N/A"}</p>
//         </div>`

// }; 


// TODO: Sends Selected Fortune data and Renders Fortune Told Page
export const getMoodFortune = async (req,res) => {
    const responseMsg = req.params.mood || req.query.mood;
    let fortune = await  getRandomMoodFortune(responseMsg)
    res.send(fortune);
}

// TODO: Sends Random Fortune Data and Renders Fortune Told Page
export const getRandomFortune = async (req,res) => {
    res.send("random");
}

// Runs API with hard coded input
export const postNewFortune = async (req, res) => {
    try {
        const { age, mood, interests, name } = req.body;
        console.log("📥 Received User Input:", req.body);

        if (!age || !mood || !interests) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const formattedInput = `I am ${age} years old. I'm currently feeling ${mood}. ${interests}`;

        const recommendations = await handleRecommendations(req, formattedInput);

        // saveUser(name, age, mood, interests);

        saveMoods(recommendations.mood);

        console.log("🔮 Recommendations:", recommendations);


        const newFortune = {
            name,
            starsign: "Unknown", 
            mood: recommendations.mood,
            book: recommendations.books[0],
            film: recommendations.movies[0],
            album: recommendations.albums[0]
        };

        await saveFortune(newFortune);

        if (!recommendations) {
            return res.renderWithLayout(`<p class="text-red-500">Error fetching recommendations.</p>`, { title: "Error" });
        }

        if (!recommendations.books?.length && !recommendations.movies?.length) {
            return res.renderWithLayout(`<p class="text-red-500">No recommendations found.</p>`, { title: "Recommendations" });
        }

        res.renderWithLayout(`
            <div class="p-6">
                <h2 class="text-xl font-bold">Your Recommendations</h2
                <!-- Movies Section -->
                <div class="mt-6">
                    <h3 class="text-lg font-semibold">Movies:</h3>
                    ${recommendations.movies?.length ? `
                        <ul class="list-none">
                            ${recommendations.movies.map(movie => `
                                <li class="mt-6 flex items-start gap-4">
                                    <img src="${movie.art || 'https://via.placeholder.com/100x150?text=No+Image'}" 
                                         alt="Movie Poster" class="w-24 h-auto rounded-md shadow-md">
                                    <div>
                                        <h4 class="font-semibold text-lg">${movie.title}</h4>
                                        <p class="text-sm text-gray-700">${movie.plot?.slice(0, 300) || "No plot available."}...</p>
                                        ${Array.isArray(movie.genres) && movie.genres.length ? 
                                          `<p class="text-xs text-gray-500 mt-2">Genres: ${movie.genres.slice(0, 3).join(", ")}</p>` : ""}
                                    </div>
                                </li>
                            `).join("")}
                        </ul>
                    ` : "<p class='text-gray-500'>No movies found.</p>"}
                </div>

                <!-- Books Section -->
                <div class="mt-6">
                    <h3 class="text-lg font-semibold">Books:</h3>
                    ${recommendations.books?.length ? `
                        <ul class="list-none">
                            ${recommendations.books.map(book => `
                                <li class="mt-6 flex items-start gap-4">
                                    <img src="${book.art || 'https://via.placeholder.com/100x150?text=No+Cover'}" 
                                         alt="Book Cover" class="w-24 h-auto rounded-md shadow-md">
                                    <div>
                                        <h4 class="font-semibold text-lg">${book.title}</h4>
                                        <p class="text-sm text-gray-700">${book.description?.slice(0, 300) || "No description available."}...</p>
                                        ${Array.isArray(book.genres) && book.genres.length ? 
                                          `<p class="text-xs text-gray-500 mt-2">Genres: ${book.genres.slice(0, 3).join(", ")}</p>` : ""}
                                    </div>
                                </li>
                            `).join("")}
                        </ul>
                    ` : "<p class='text-gray-500'>No books found.</p>"}
                </div>

                <!-- Albums Section -->
                <div class="mt-6">
                    <h3 class="text-lg font-semibold">Albums:</h3>
                    ${recommendations.albums?.length ? `
                        <ul class="list-none">
                            ${recommendations.albums.map(album => `
                                <li class="mt-6 flex items-start gap-4">
                                    <img src="${album.art || 'https://via.placeholder.com/100x150?text=No+Cover'}" 
                                         alt="Book Cover" class="w-24 h-auto rounded-md shadow-md">
                                    <div>
                                        <h4 class="font-semibold text-lg">${album.title}</h4>
                                        <p class="text-sm text-gray-700">${album.artist?.slice(0, 300) || "No artist available."}</p>
                                        ${Array.isArray(album.genres) && album.genres.length ? 
                                          `<p class="text-xs text-gray-500 mt-2">Genres: ${album.genres.slice(0, 3).join(", ")}</p>` : ""}
                                    </div>
                                </li>
                            `).join("")}
                        </ul>
                    ` : "<p class='text-gray-500'>No books found.</p>"}
                </div>
            </div>
        `, { title: "Recommendations" });

    
    } catch (error) {
        console.error("Error in runAPI:", error);
        res.status(500).json({ error: "Error generating fortune" });
    }
};
