import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";
import { randomImage } from "../randomImage.js";
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
import { getMusic } from "../apis/musicApi.js";
import { getBook } from "../apis/bookApi.js";
import { getFilm } from "../apis/movieApi.js";

const __dirname = import.meta.dirname;

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Renders Home Page
export const getHomePage = async (req, res) => {
    let mood = await getCommonMood() + "";
    
    res.renderWithLayout(`
        <div class="flex flex-col items-center mt-10">
            <div id="greeting-container" class="bg-white rounded-full px-6 py-3 shadow-md h-16 flex items-center justify-center min-w-[280px]">
                <p id="greeting-text" class="text-blue-600 text-lg font-medium text-center">Hey there good looking</p>
            </div>
        </div>
        
        <div id="button-container" 
     class="grid grid-cols-2 gap-4 mt-8 mx-auto max-w-md opacity-0 transition-opacity duration-500">

  <a href="/new"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200  px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
     Full Fortune Experience
  </a>

  <a href="/random"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200  px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
    Express Fortune
  </a>

  <a href="/mood"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200 px-6 py-3 rounded-xl shadow-lg
            transform transition-transform duration-30 0 hover:-translate-y-1 hover:shadow-2xl">
    Pre-Coffee Fortune
  </a>

  <a href="" id="common-mood"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200 px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
  </a>
  <a href="/test"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center col-span-2 border border-yellow-200 px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
    Test Style
  </a>

</div>

        <script>
            function commonMoodButton() {
                let route = "/mood/${mood}";
                let link = document.getElementById("common-mood");
                link.href = route;
                link.innerText = "Everyone's feeling ${mood} today";
            }
            
            function animateGreetings() {
                const greetingText = document.getElementById("greeting-text");
                const greetingContainer = document.getElementById("greeting-container");
                const buttonContainer = document.getElementById("button-container");
                
                const messages = [
                    "Hey there, good looking!",
                    "I have been expecting you...",
                    "What guidance are you looking for today?"
                ];
                
                let currentMessage = 0;
                
                // Show the initial message
                greetingText.textContent = messages[currentMessage];
                
                // Function to display subsequent messages
                function displayNextMessage() {
                    // Fade out the current message
                    greetingContainer.classList.add("opacity-0");
                    
                    setTimeout(() => {
                        currentMessage++;
                        
                        // If we still have another message to show
                        if (currentMessage < messages.length) {
                            greetingText.textContent = messages[currentMessage];
                            greetingContainer.classList.remove("opacity-0");
                            
                            // If this is NOT the last message, schedule another transition
                            if (currentMessage < messages.length - 1) {
                                setTimeout(displayNextMessage, 2000);
                            } else {
                                // If it IS the last message, let it remain on screen,
                                // then reveal the buttons after a pause
                                setTimeout(() => {
                                    buttonContainer.classList.remove("opacity-0");
                                }, 2000);
                            }
                        }
                    }, 500); // 0.5s fade-out before switching to the next text
                }
                
                // Add transition class after initial render
                setTimeout(() => {
                    greetingContainer.classList.add("transition-opacity", "duration-500");
                    
                    // Start message transitions after 2 seconds
                    setTimeout(displayNextMessage, 2000);
                }, 100);
            }
            
            window.onload = function() {
                commonMoodButton();
                animateGreetings();
            };
        </script>
    `, { title: "Fortune Teller Home" });
};



// Renders New Fortune Page
export const getNewFortunePage = async (req, res) => {
    res.renderWithLayout(`
      <div class="flex items-center justify-center mt-6">
        <form 
          id="fortune-form" 
          action="/new" 
          method="post"
          class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 
                 border border-yellow-600 text-yellow-100
                 rounded-xl shadow-xl p-6 w-11/12 max-w-2xl"
        >
          <h2 class="text-2xl font-bold mb-4 text-center">
            Reveal Your Fortune
          </h2>
  
          <div class="grid grid-cols-3 gap-6">
            <div class="flex flex-col">
              <label for="name" class="font-semibold text-yellow-200 mb-1">
                Name
              </label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                class="bg-purple-800 border border-yellow-500 text-yellow-100
                       placeholder-yellow-300 rounded-md p-3
                       focus:outline-none focus:ring-2 focus:ring-yellow-300
                       w-full"
                placeholder="Enter your name"
              >
            </div>
            <div class="flex flex-col">
              <div id="starsign-dropdown" class="hidden">
                <label for="starsign" class="font-semibold text-yellow-500 mb-1">
                  Starsign
                </label>
                <select
                  id="starsign"
                  name="starsign"
                  class="bg-purple-800 border border-yellow-500 text-yellow-100
                         placeholder-yellow-300 rounded-md p-3
                         focus:outline-none focus:ring-2 focus:ring-yellow-300
                         w-full"
                >
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
                <label for="dob" class="font-semibold text-yellow-200 mb-1">
                  Date of Birth
                </label>
                <input 
                  id="dob" 
                  name="dob" 
                  type="date" 
                  class="bg-purple-800 border border-yellow-500 text-yellow-100
                         placeholder-yellow-300 rounded-md p-3
                         focus:outline-none focus:ring-2 focus:ring-yellow-300
                         w-full"
                >
              </div>
              <button 
                id="change-sign-input-type" 
                type="button"
                class="text-sm mt-2 underline text-yellow-200 hover:text-yellow-300"
              >
                Use Starsign Instead
              </button>
            </div>
            <div class="flex flex-col">
              <label for="mood" class="font-semibold text-yellow-200 mb-1">
                Current Mood
              </label>
              <input 
                id="mood" 
                name="mood" 
                type="text"
                class="bg-purple-800 border border-yellow-500 text-yellow-100
                       placeholder-yellow-300 rounded-md p-3
                       focus:outline-none focus:ring-2 focus:ring-yellow-300
                       w-full"
                placeholder="E.g. Curious, excited, anxious..."
              >
            </div>
          </div>
  
          <div class="mt-6">
            <label for="interests" class="block font-semibold text-yellow-200 mb-1">
              Have you watched anything decent lately?
            </label>
            <textarea 
              id="interests"
              name="interests"
              class="bg-purple-800 border border-yellow-200 text-yellow-100
                     placeholder-yellow-300 rounded-md p-3
                     focus:outline-none focus:ring-2 focus:ring-yellow-300
                     w-full h-24"
              placeholder="Share the good stuff..."
            ></textarea>
          </div>
  
          <div class="mt-6 flex justify-center">
            <button 
              id="submit-form" 
              type="submit"
              class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700
                     border border-yellow-600 text-yellow-100 
                     px-8 py-3 rounded-lg text-lg font-semibold 
                     shadow-md transform transition-transform duration-300
                     hover:-translate-y-1 hover:shadow-2xl
              "
            >
              See my future
            </button>
          </div>
        </form>
      </div>
  
      <script src="./scripts/new-fortune.js"></script>
    `, 
    { title: "Fortune Teller - About You", nav: true });
  };
  


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
            movies: fortune.film ? [{ title: fortune.film.title, art: fortune.film.art, genres: fortune.film.genres, plot: fortune.film.plot }] : [],
            books: fortune.book ? [{ title: fortune.book.title, art: fortune.book.art, genres: fortune.book.genres, description: fortune.book.description }] : [],
            albums: fortune.album ? [{ title: fortune.album.title, artist: fortune.album.artist, genres: fortune.album.genres, art: fortune.album.art }] : []
        };

        res.renderWithLayout(await generateCardLayout(recommendations), { 
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

        res.renderWithLayout(await generateCardLayout(recommendations), { 
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
const generateCardLayout = async (recommendations) => {
    const cards = [
        { type: 'movie', item: recommendations.movies?.[0] },
        { type: 'book', item: recommendations.books?.[0] },
        { type: 'album', item: recommendations.albums?.[0] }
    ];
    let images = await randomImage();
    return `
        <div id="card-grid" class="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto p-4">
            ${cards.map(({ type, item }, i) => `
                <div id="${type}-card-div" class="flip-card h-[450px] w-full min-w-[280px] opacity-0 animate-deal" >
                    <div id="${type}-card" class="flip-card-inner border-8 border-solid border-white rounded-lg">
                        <div class="flip-card-front shadow-lg overflow-hidden" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                            <img src="/Images/${images[i]}" alt="Tarot Card Back" class="w-full h-full object-cover">
                        </div>
                       <div class="flex flex-col justify-between flip-card-back bg-white shadow-lg p-6">
                            ${item ? `
                                <div class="flex flex-col items-center h-full" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                                    <img src="${item.art || `https://via.placeholder.com/100x150?text=No+${type}+Image`}" 
                                            alt="${type} cover" class="w-32 h-32 object-scale-down rounded-md mb-4">
                                    <h4 class="font-semibold text-center text-lg mb-2">${item.title}</h4>
                                    ${type === 'album' ? `
                                        <p class="text-md text-gray-600 mb-2">${item.artist}</p>
                                        <p class="text-sm text-gray-500">Genres: ${item.genres.join(', ')}</p>
                                    ` : `
                                        <p class="text-sm text-gray-600 mb-2">Genres: ${item.genres.join(', ')}</p>
                                        <p class="text-sm text-gray-500 text-center max-h-32 overflow-y-auto">${item.plot || item.description || ''}</p>
                                    `}
                                </div>
                                <div class="flex justify-between">
                                    <button id="lock-btn" type="button" class="${type} border-2 border-solid border-black rounded-sm">Lock</button>
                                    <button id="delete-btn"  type="button" class="${type} border-2 border-solid border-black rounded-sm">XXXX</button>
                                </div>
                            ` : `<p class="text-gray-500 text-center">No ${type} found</p>`}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div id="unlocked-types-list" class="movie book album"></div>
        <div id="screen-cover" class="hidden absolute w-screen h-screen bg-transparent">
            <div id="confirm-delete" class="absolute bg-white p-8">
                <p>Confirm that you would like to delete this recommendation from your fortune</p>
                <p>AND that you do not want to recieve any more recommendations of this type</p>
                <button id="cancel-delete-btn" type="button" class="bg-grey-500">Cancel</button>
                <button id="confirm-delete-btn" type="button" class="bg-red-500" value="">Confirm Deletion</button>
            </div>
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
            #unlocked-types-list {
                display: none;
            }
        </style>
        <script type="module" src="./scripts/fortune-display.js"></script>
    `;
}

// res.renderWithLayout(generateCardLayout(recommendations), 
//             { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
//         );



// Runs when /new Post request is made
export const postNewFortune = async (req, res) => {

    try {
        const { dob, starsign, mood, interests, name } = req.body;
        // console.log("📥 Received User Input:", req.body);
        
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

        res.renderWithLayout(await generateCardLayout(recommendations), 
            { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
        );
    
    } catch (error) {
        console.error("Error in runAPI:", error);
        res.status(500).json({ error: "Error generating fortune" });
    }
};

export const testRecs  = async (req, res) => {
    const book = await getBook({isbnCode:"978-0307387899"})
    const album = await getMusic({title:'Rage Against the Machine',artist:'Rage Against the Machine'});
    const movie = await getFilm({title:"Mad Max: Fury Road"})
    const recommendations = {
        books: [book],
        albums: [album],
        movies: [movie]
    }
    res.renderWithLayout(await generateCardLayout(recommendations), 
        { title: "Your Fortune", nav: true, fortuneTellerImg: 'fadein' }
    );
}
// Get unlocked via id. Get class - this has space seperated list of unlocked. Split via space. Pass this to a refacted openAi call. 
// Get just that item. Reload that element. Will have to check styling and animations
