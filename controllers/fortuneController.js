import {v4 as uuidv4} from 'uuid'

import { handleRecommendations } from "../apis/openAiApi.js";
import { saveMoods, saveFortune, getRandom } from "../storage.js";
import { getAge, getStarsign } from "../utils/helpers.js";
import { generateCardLayout } from "../utils/generateCardLayout.js";



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
                     border border-yellow-300 text-yellow-100 
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
  

// Runs when /new Post request is made
export const postNewFortune = async (req, res) => {

    try {
        const { dob, starsign, mood, interests, name } = req.body;
        // console.log("Received User Input:", req.body);
        
        if ((!dob && !starsign) || !mood || !interests) {
            return res.status(400).json({ err8or: "Missing required fields" });
        }

        const _id = uuidv4();

        let age;
        let starsignFromDoB;

        if (dob) {
            const dateOfBirth = new Date(dob);
            age = getAge(dateOfBirth);
            starsignFromDoB = getStarsign(dateOfBirth)
        } else if (starsign) {
            age = 25;
        }

        

        const recommendations = await handleRecommendations(req,{age,mood,interests});

        console.log("Recommendations:", recommendations);
       


        const newFortune = {
            _id,
            name,
            starsign: starsign || starsignFromDoB, 
            mood: recommendations.mood,
            books: recommendations.books[0],
            movies: recommendations.movies[0],
            albums: recommendations.albums[0]
        };

        await saveFortune(newFortune);
        await saveMoods(recommendations.mood);

        
        if (!recommendations) {
            return res.renderWithLayout(`<p class="text-red-500">Error fetching recommendations.</p>`, { title: "Error" });
        }

        if (!recommendations.books?.length && !recommendations.movies?.length) {
            return res.renderWithLayout(`<p class="text-red-500">No recommendations found.</p>`, { title: "Recommendations" });
        }

  

        res.renderWithLayout(await generateCardLayout(recommendations, _id), 
            { title: "Your Fortune", nav: true, fortuneTellerImg: 'success' }
        );
    
    } catch (error) {
        console.error("Error in runAPI:", error);
        res.status(500).json({ error: "Error generating fortune" });
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
