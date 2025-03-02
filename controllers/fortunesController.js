import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import 'dotenv/config';
import path from 'path';
import bodyParser from "body-parser";
import { handleRecommendations } from "../apis/openAiApi.js";

const __dirname = import.meta.dirname;

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Renders Home Page
export const getHomePage = async (req, res) => {
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
              <a href="/fortunes/new" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">New Fortune</a>
              <a href="/fortunes/random" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Random</a>
              <a href="/fortunes/mood" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Mood Select</a>
              <a href="/fortunes/mood/angry" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">(Common Mood)</a>
              <a href="/fortunes/run-api" class="text-green-600 border border-green-600 px-6 py-3 rounded-lg">Run API</a>
        </div>
    `, { title: "Fortune Teller Home" });
}

// Renders New Fortune Page
export const getNewFortunePage = async (req,res) => {
    res.renderWithLayout(`
        <div class="relative flex flex-col items-center">
            <div class="w-40 h-fit flex items-center justify-center border-4 border-red-500 rounded-lg">
                <img class="w-40" src="/FortuneTellerImages/gifs/CR-default.gif" alt="" id="fortuneteller-img">
            </div>
            <div class="absolute top-0 right-[-50px] bg-white border border-red-500 rounded-full px-4 py-2">
                <p class="text-red-500 text-sm">Tell me about yourself</p>
            </div>
        </div>
        <form action="/fortunes/new" method="post">
            <div class="grid grid-cols-3 gap-6 mt-6 w-3/4 max-w-2xl">
                <div class="flex flex-col">
                    <label class="font-semibold">Name</label>
                    <input type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold">Date of Birth</label>
                    <input type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold">Mood</label>
                    <input type="text" class="border border-gray-400 p-2 rounded w-full">
                </div>
            </div>
            <div class="mt-6 w-3/4 max-w-2xl">
                <label class="block font-semibold">Interests</label>
                <textarea class="w-full border border-gray-400 p-3 rounded h-24"></textarea>
            </div>
            <div class="mt-6">
                <button class="border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg">See my future</button>
            </div>
        </form>
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
export const postNewFortune = async (req,res) => {
    console.log(req.body);
    res.send("New");
}

// TODO: Sends Selected Fortune data and Renders Fortune Told Page
export const getMoodFortune = async (req,res) => {
    const responseMsg = req.params.mood || req.query.mood;
    res.send(responseMsg)
}

// TODO: Sends Random Fortune Data and Renders Fortune Told Page
export const getRandomFortune = async (req,res) => {
    res.send("random");
}

// Runs API with hard coded input
export const runAPI = async (req, res) => {
    try {
        const recommendations = await handleRecommendations(req);

        if (!recommendations) {
            return res.renderWithLayout(`<p class="text-red-500">Error fetching recommendations.</p>`, { title: "Error" });
        }

        if (!recommendations.books?.length && !recommendations.movies?.length) {
            return res.renderWithLayout(`<p class="text-red-500">No recommendations found.</p>`, { title: "Recommendations" });
        }

        res.renderWithLayout(`
            <div class="p-6">
                <h2 class="text-xl font-bold">Your Recommendations</h2>

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
        console.error("Error running API:", error);
        if (!res.headersSent) {
            res.renderWithLayout(`<p class="text-red-500">Error fetching recommendations.</p>`, { title: "Error" });
        }
    }
};
