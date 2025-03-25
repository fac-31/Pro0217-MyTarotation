var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getBook } from "../apis/bookApi.js";
import { getMusic } from "../apis/musicApi.js";
import { getFilm } from "../apis/movieApi.js";
import { generateCardLayout } from "../utils/generateCardLayout.js";
import { retrieveUnique } from "../storage.js";
// This file can be deleted once all layout tests are completed
export const testRecs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield getBook({ isbnCode: "978-0307387899" });
    const album = yield getMusic({ title: 'Rage Against the Machine', artist: 'Rage Against the Machine' });
    const movie = yield getFilm({ title: "Mad Max: Fury Road" });
    let fortune = yield retrieveUnique("f008a9ce-dd74-4796-9264-c58e5c6c64f5");
    const recommendations = {
        books: fortune.book,
        albums: fortune.album,
        movies: fortune.film,
    };
    res.renderWithLayout(yield generateCardLayout(recommendations, fortune._id), { title: "Your Fortune", nav: true, fortuneTellerImg: 'fadein' });
});
// Get unlocked via id. Get class - this has space seperated list of unlocked. Split via space. Pass this to a refacted openAi call. 
// Get just that item. Reload that element. Will have to check styling and animations
