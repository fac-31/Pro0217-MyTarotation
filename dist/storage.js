var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import persist from 'node-persist';
import schedule from 'node-schedule';
// Creates storage with logging set to true. This will console log when an item is set, written etc
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield persist.init({});
    let fortunes = yield persist.getItem("fortunes");
    if (!fortunes) {
        yield persist.setItem("fortunes", [
            { "_id": "f008a9ce-dd74-4796-9264-c58e5c6c64f5", "name": "Johnathan", "starsign": "cancer", "mood": "chilled",
                "books": { "title": "Annihilation", "art": "https://covers.openlibrary.org/b/id/8408974-M.jpg",
                    "description": "Area X has been cut off from the rest of the continent for decades. Nature has reclaimed the last vestiges of human civilization. The twelfth expedition arrives expecting the unexpected, and Area X delivers. They discover a massive topographic anomaly and life-forms that surpass understanding. But it's the surprises that came across the border with them, and the secrets the expedition members are keeping from one another that change everything.",
                    "genres": ["nebula award winner", "award:nebula_award=novel", "award:nebula_award=2015"] },
                "films": { "title": "Passengers",
                    "plot": "A malfunction in a sleeping pod on a spacecraft traveling to a distant colony planet wakes one passenger 90 years early.",
                    "genres": ["drama", "romance", "sci-fi"],
                    "art": "https://m.media-amazon.com/images/M/MV5BYzRjNTFmMzQtM2JhZi00ZTI0LTlhMjMtNzQ4YWRhZGVmZWRmXkEyXkFqcGc@._V1_SX300.jpg" },
                "albums": { "title": "In the Aeroplane Over the Sea", "artist": "Neutral Milk Hotel",
                    "genres": ["alternative rock", "brass band", "folk rock"],
                    "art": "http://coverartarchive.org/release/023fcf90-dca7-4a4e-a4e2-ed0eaba78f9e/8579764982.jpg" } },
            { "_id": "f008a9be-dd74-4796-9264-c58e5c6c64f5", "name": "Scott", "starsign": "cancer", "mood": "happy",
                "books": { "title": "Fight Club", "art": "https://covers.openlibrary.org/b/id/7890578-M.jpg",
                    "description": "A man who struggles with insomnia meets a colorful extremist, and they create a secret organization together.\r\n\r\nChuck Palahniuk showed himself to be his generation’s most visionary satirist in this, his first book. Fight Club’s estranged narrator leaves his lackluster job when he comes under the thrall of Tyler Durden, an enigmatic young man who holds secret after-hours boxing matches in the basement of bars. There, two men fight \"as long as they have to.\" This is a gloriously original work that exposes the darkness at the core of our modern world.",
                    "genres": ["fiction", "millennialism", "young men"] },
                "films": { "title": "Whiplash",
                    "plot": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
                    "genres": ["drama", "music"],
                    "art": "https://m.media-amazon.com/images/M/MV5BMDFjOWFkYzktYzhhMC00NmYyLTkwY2EtYjViMDhmNzg0OGFkXkEyXkFqcGc@._V1_SX300.jpg" },
                "albums": { "title": "Songs for the Deaf", "artist": "Queens of the Stone Age",
                    "genres": ["alternative metal", "alternative rock", "desert rock"],
                    "art": "http://coverartarchive.org/release/989e8e77-6263-45e6-a8e5-8228fed65532/28387489485.jpg" } }
        ]);
    }
}))();
export function saveFortune(fortune) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fortunes = (yield persist.getItem("fortunes")) || [];
            fortunes.push(fortune);
            yield persist.setItem("fortunes", fortunes);
            // console.log("New fortune saved:", fortune);
            return fortune;
        }
        catch (error) {
            console.error("Error saving fortune:", error.message);
        }
    });
}
// Function to add users. We may not need to store this as I don't think we resuse this info but we may want to in the future 
// export async function saveUser(name, age, mood, recommendations) {
//     try {
//         const userData = { name, age, mood, recommendations};
//         return await persist.setItem(name, userData);
//     } catch (error) {
//         console.log("Error setting user: " + error.message)
//     }
//   };
// Clears all stored data
export function clear() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield persist.clear();
        }
        catch (error) {
            console.log("Error clearing storage: " + error.message);
        }
    });
}
;
schedule.scheduleJob('0 0 * * *', clear);
// Saves moods and their popularity to access for the random mood call
export function saveMoods(mood) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let moods = yield persist.getItem('moods');
            if (!moods) {
                moods = {
                    "chilled": 1,
                    "happy": 1
                };
            }
            ;
            moods[mood] = moods[mood] ? moods[mood] + 1 : 1;
            return yield persist.setItem('moods', moods);
        }
        catch (error) {
            console.log("Error setting mood: " + error.message);
        }
        ;
    });
}
;
export function getCommonMood() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let moods = yield persist.getItem("moods");
            let common = "happy";
            for (const mood in moods) {
                // console.log(moods[mood]);
                // console.log(moods[common]);
                if (moods[mood] > moods[common]) {
                    common = mood;
                }
                ;
            }
            ;
            return common;
        }
        catch (error) {
            console.log("Error fetching common mood: " + error.message);
        }
        ;
    });
}
;
export function getRandomMoodFortune(mood) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fortunes = yield persist.getItem("fortunes");
            let moodFortunes = fortunes.filter(x => x.mood === mood);
            let num = Math.floor(Math.random() * moodFortunes.length);
            let selectedFortune = moodFortunes[num];
            return selectedFortune;
        }
        catch (error) {
            console.log("Error fetching common mood fortune: " + error.message);
        }
    });
}
export function getRandom() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fortunes = yield persist.getItem("fortunes");
            let num = Math.floor(Math.random() * fortunes.length);
            let selectedFortune = fortunes[num];
            return selectedFortune;
        }
        catch (error) {
            console.log("Error fetching common mood fortune: " + error.message);
        }
    });
}
export function retrieveItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield persist.getItem(item);
            return data;
        }
        catch (error) {
            console.log("Error getting item :" + error.message);
        }
        ;
    });
}
;
export function retrieveUnique(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fortunes = yield persist.getItem("fortunes");
            let unique = fortunes.filter(x => x._id == _id);
            return unique[0];
        }
        catch (error) {
            console.log("Error getting unique fortune :" + error.message);
        }
        ;
    });
}
