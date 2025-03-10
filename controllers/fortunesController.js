import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";
import { 
    handleRecommendations, 
    matchMood 
} from "../apis/openAiApi.js";
import { 
    saveMoods,
    getCommonMood, 
    getRandomMoodFortune, 
    getRandom,
    saveFortune
} from "../storage.js";
import starsigns from "../lib/starsigns.js";

const __dirname = import.meta.dirname;

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Renders Home Page
export const getHomePage = async (req, res) => {
    let mood = await getCommonMood() + "";
    console.log(mood);
    res.renderWithLayout(`
             <div class="bg-white rounded-full px-4 py-2 mt-10">
                  <p class="text-red-500 text-sm animate-typewriter">How are you feeling?</p>
              </div>
        <div class="grid grid-cols-2 gap-6 mt-10">
          
            <a href="/new" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">New Fortune</a>
            <a href="/random" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Random</a>
            <a href="/mood" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Mood Select</a>
            <a href="" id="common-mood" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg"></a>
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
        
        <form id="fortune-form" action="/new" method="post">
            <div class="grid grid-cols-3 gap-6 mt-6 w-3/4 max-w-2xl">
                <div class="flex flex-col">
                    <label for="name" class="font-semibold">Name</label>
                    <input id="name" name="name" type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
                <div class="flex flex-col">
                    <div id="starsign-dropdown" class="hidden">
                        <label for="starsign" class="font-semibold">Starsign</label>
                        <select id="starsign" name="starsign" type="text" class="border border-gray-400 p-2 rounded w-full">
                            <option value="aquarius">Aquarius</option>
                            <option value="pisces">Pisces</option>
                            <option value="aries">Aries</option>
                            <option value="taurus">Taurus</option>
                            <option value="gemini">Gemini</option>
                            <option value="cancer">Cancer</option>
                            <option value="leo">Leo</option>
                            <option value="virgo">Virgo</option>
                            <option value="libra">Libra</option>
                            <option value="scorpio">Scorpio</option>
                            <option value="sagittarius">Sagittarius</option>
                            <option value="capricorn">Capricorn</option>
                        </select>
                    </div>
                    <div id="dob-date" class="block">
                        <label for="dob" class="font-semibold">Date of Birth</label>
                        <input id="dob" name="dob" type="date" class="border border-gray-400 p-2 rounded w-full">
                    </div>
                <button id="change-sign-input-type" class="text-sm" type="button">Use Starsign Instead</button>
                </div>
                <div class="flex flex-col">
                    <label for="mood" class="font-semibold">Current Mood</label>
                    <input id="mood" name="mood" type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
            </div>
            <div class="mt-6 w-3/4 max-w-2xl">
                <label for="interests" class="block font-semibold">Have you watched anything decent lately?</label>
                <textarea id="interests" name="interests" class="w-full border border-gray-400 p-2 rounded h-24"></textarea>
            </div>
            <div class="mt-6">
                <button id="submit-form" type="submit" class="border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg">See my future</button>
            </div> 
        </form>
        <script src="./scripts/new-fortune.js"></script>

    `, { title: "Fortune Teller - About You", nav: true });
}


// Renders Mood Select Page
export const getMoodPage = async (req,res) => {
    res.renderWithLayout(`
        
        <form class="flex flex-col items-center mt-6" action="/mood" method="get">
            <label for="mood" class="text-black mb-2">Mood</label>
            <input type="text" id="mood" name="mood" class="border border-black px-4 py-2 rounded-md" required>
            <button id="submit-form" class="border border-green-600 text-green-600 px-6 py-3 rounded-lg text-lg mt-6">Get Fortune</button>
        </form>
        <script src="./scripts/mood-select.js"></script>
    `, { title: "Fortune Teller - Mood", nav: true });
}

// Sends Selected Fortune data and Renders Fortune Told Page
export const getMoodFortune = async (req, res) => {
    try {
        let requestMsg = req.params.mood || req.query.mood;

        if (req.query.mood) {
            const matchMoodAIresponse = await matchMood(requestMsg);
            requestMsg = matchMoodAIresponse.closestMood;
            console.log("Matched Mood:", requestMsg);
        }

        let fortune = await getRandomMoodFortune(requestMsg);

        if (!fortune) {
            return res.renderWithLayout(`<p class="text-red-500">No fortune found for this mood.</p>`, { title: "Mood Fortune" });
        }

        // Extract recommendations
        const recommendations = {
            movies: fortune.film ? [{ title: fortune.film.title, art: fortune.film.art, genres: fortune.film.genres, plot: fortune.film.plot }] : [],
            books: fortune.book ? [{ title: fortune.book.title, art: fortune.book.art, genres: fortune.book.genres, description: fortune.book.description }] : [],
            albums: fortune.album ? [{ title: fortune.album.title, artist: fortune.album.artist, genres: fortune.album.genres, art: fortune.album.art }] : []
        };

        res.renderWithLayout(generateCardLayout(recommendations), { 
            title: `Your Fortune - ${requestMsg}`, 
            nav: true, 
            fortuneTellerImg: 'success' 
        });

    } catch (error) {
        console.error("Error fetching mood-based fortune:", error);
        res.status(500).json({ error: "Error retrieving fortune" });
    }
};


// Sends Random Fortune Data and Renders Fortune Told Page
export const getRandomFortune = async (req, res) => {
    try {
        let fortune = await getRandom();
        
        if (!fortune) {
            return res.renderWithLayout(`<p class="text-red-500">No random fortune available.</p>`, { title: "Random Fortune" });
        }

        // Extract recommendations
        const recommendations = {
            movies: fortune.film ? [{ title: fortune.film.title, art: fortune.film.art, genres: fortune.film.genres, plot: fortune.film.plot }] : [],
            books: fortune.book ? [{ title: fortune.book.title, art: fortune.book.art, genres: fortune.book.genres, description: fortune.book.description }] : [],
            albums: fortune.album ? [{ title: fortune.album.title, artist: fortune.album.artist, genres: fortune.album.genres, art: fortune.album.art }] : []
        };

        res.renderWithLayout(generateCardLayout(recommendations), { 
            title: "Random Fortune", 
            nav: true, 
            fortuneTellerImg: 'success' 
        });

    } catch (error) {
        console.error("Error fetching random fortune:", error);
        res.status(500).json({ error: "Error retrieving fortune" });
    }
};



/**
 * Calculates a user's age based on their DoB and the current Date
 * @param {Date} dob - Date object from dob input
 * @returns User's age in years
 */
const getAge = (dob) => {
    const today = Date.now();
    const diff = new Date(today - dob);
    return Math.abs(diff.getUTCFullYear() - 1970);
}

/**
 * Uses lib/starsigns to lookup the user's starsign based on their month and day of birth
 * @param {Date} dob - Date object from dob input
 * @returns User's Starsign
 */
const getStarsign = (dob) => {
    const birthMonth = dob.getMonth();
    const starMonth = birthMonth - (starsigns.dateChange[birthMonth] > dob.getDate() ? 1 : 0)
    return starsigns.monthEndSign.at(starMonth);
}

// Shared card layout
const generateCardLayout = (recommendations) => {
    const cards = [
        { type: 'movie', item: recommendations.movies?.[0] },
        { type: 'book', item: recommendations.books?.[0] },
        { type: 'album', item: recommendations.albums?.[0] }
    ];

    return `
        ${recommendations.warning && ` <div class="text-red-500 p-4">
            <p><strong>Warning:</strong> ${recommendations.warning}</p>
        </div>`}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto p-4">
            ${cards.map(({ type, item }) => `
                <div class="flip-card h-[450px] w-full min-w-[280px] opacity-0 animate-deal" onclick="this.querySelector('.flip-card-inner').classList.toggle('flipped')">
                    <div class="flip-card-inner">
                        <div class="flip-card-front bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src="/Images/tarot-back-generic.png" alt="Tarot Card Back" class="w-full h-full object-cover">
                        </div>
                        <div class="flip-card-back bg-white rounded-lg shadow-lg p-6">
                            ${item ? `
                                <div class="flex flex-col items-center h-full">
                                    <img src="${item.art || `https://via.placeholder.com/100x150?text=No+${type}+Image`}" 
                                            alt="${type} cover" class="w-32 h-32 object-cover rounded-md mb-4">
                                    <h4 class="font-semibold text-center text-lg mb-2">${item.title}</h4>
                                    ${type === 'album' ? `
                                        <p class="text-md text-gray-600 mb-2">${item.artist}</p>
                                        <p class="text-sm text-gray-500">Genres: ${item.genres.join(', ')}</p>
                                    ` : `
                                        <p class="text-sm text-gray-600 mb-2">Genres: ${item.genres.join(', ')}</p>
                                        <p class="text-sm text-gray-500 text-center max-h-32 overflow-y-auto">${item.plot || item.description || ''}</p>
                                    `}
                                </div>
                            ` : `<p class="text-gray-500 text-center">No ${type} found</p>`}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <style>
            .flip-card {
                perspective: 1000px;
                cursor: pointer;
            }
            .flip-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s;
                transform-style: preserve-3d;
            }
            .flip-card-inner.flipped {
                transform: rotateY(180deg);
            }
            .flip-card-front, .flip-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
            }
            .flip-card-back {
                transform: rotateY(180deg);
            }
        </style>
    `;
}

// res.renderWithLayout(generateCardLayout(recommendations), 
//             { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
//         );



// Runs when /new Post request is made
export const postNewFortune = async (req, res) => {

    try {
        const { dob, starsign, mood, interests, name } = req.body;
        console.log("📥 Received User Input:", req.body);
        
        if ((!dob && !starsign) || !mood || !interests) {
            return res.status(400).json({ err8or: "Missing required fields" });
        }

        let age;
        let starsignFromDoB;

        if (dob) {
            const dateOfBirth = new Date(dob);
            age = getAge(dateOfBirth);
            starsignFromDoB = getStarsign(dateOfBirth)
        } else if (starsign) {
            age = 25;
        }

        

        const recommendations = await handleRecommendations(req, req.body);

        console.log("🔮 Recommendations:", recommendations);
       


        const newFortune = {
            name,
            starsign: starsign || starsignFromDoB, 
            mood: recommendations.mood,
            book: recommendations.books[0],
            film: recommendations.movies[0],
            album: recommendations.albums[0]
        };

        await saveFortune(newFortune);
        await saveMoods(recommendations.mood);

        
        if (!recommendations) {
            return res.renderWithLayout(`<p class="text-red-500">Error fetching recommendations.</p>`, { title: "Error" });
        }

        if (!recommendations.books?.length && !recommendations.movies?.length) {
            return res.renderWithLayout(`<p class="text-red-500">No recommendations found.</p>`, { title: "Recommendations" });
        }

        res.renderWithLayout(generateCardLayout(recommendations), 
            { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
        );
    
    } catch (error) {
        console.error("Error in runAPI:", error);
        res.status(500).json({ error: "Error generating fortune" });
    }
};
