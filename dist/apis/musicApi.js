var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { group } from "console";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
export function getMusic(recommend) {
    return __awaiter(this, void 0, void 0, function* () {
        const music = recommend;
        let title = music.title.replace(/ /g, "+");
        let artist = music.artist.replace(/ /g, "+");
        let musicSchema = z.object({
            title: z.string(),
            artist: z.string(),
            genres: z.array(z.string()),
            art: z.string()
        });
        try {
            const musicObject = yield fetch(`https://musicbrainz.org/ws/2/release?fmt=json&query=release:${title}%20AND%20artist:${artist}`, {
                method: "GET",
                headers: {
                    "User-Agent": "MyTarotation/1.0.0"
                }
            })
                .then(response => response.json())
                .then(data => data.releases[0])
                .catch(err => console.log(err));
            const mbid = musicObject['release-group'].id;
            console.log('MBID', mbid);
            title = musicObject.title;
            artist = musicObject['artist-credit'].map(a => a.name).join(", ");
            const coverArt = yield fetch(`http://coverartarchive.org/release-group/${mbid}`, {
                method: "GET",
                headers: {
                    "User-Agent": "MyTarotation/1.0.0"
                }
            })
                .then(response => response.json())
                .then(data => data.images[0].image)
                .catch(err => console.log(err));
            const genres = yield fetch(`https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json&inc=genres`, {
                method: "GET",
                headers: {
                    "User-Agent": "MyTarotation/1.0.0"
                }
            })
                .then(response => response.json())
                .then(data => {
                return data.genres.map(g => g.name);
            })
                .catch(err => console.log(err));
            let returnObject = {
                title: title,
                artist: artist,
                genres: genres.map(genre => genre.toLowerCase()).slice(0, 3),
                art: coverArt
            };
            const result = musicSchema.safeParse(returnObject);
            if (!result.success) {
                console.error("Validation Error:", result.error);
                throw new Error("Invalid musicApi response format");
            }
            ;
            return result.data;
        }
        catch (error) {
            console.log("Error fetching Music details: " + error);
        }
        ;
    });
}
