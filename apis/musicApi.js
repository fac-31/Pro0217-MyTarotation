import { group } from "console";
import dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

export async function getMusic(recommend) {

    const music = recommend;

    console.log(music);

    let title = music.title.replace(/ /g, "+");
    let artist = music.artist.replace(/ /g, "+");

    let musicSchema = z.object({
        title: z.string(),
        artist: z.string(),
        genres: z.array(z.string()),
        art: z.string()
    });
    
    try {

        const musicObject = await fetch(`https://musicbrainz.org/ws/2/release?fmt=json&query=release:${title}%20AND%20artist:${artist}`, {
            method: "GET",
            headers: {
                "User-Agent": "MyTarotation/1.0.0"
            }
        })
            .then(response => response.json())
            .then(data => data.releases[0])
            .catch(err => console.log(err));
        
        const mbid = musicObject['release-group'].id
        title = musicObject.title;
        artist = musicObject['artist-credit'].map(a => a.name).join(", ");

        console.log(musicObject);

        const coverArt = await fetch(`http://coverartarchive.org/release-group/${mbid}`, {
            method: "GET",
            headers: {
                "User-Agent": "MyTarotation/1.0.0"
            }
        })
            .then(response => response.json())
            .then(data => data.images[0].image)
            .catch(err => console.log(err));
        
        console.log(coverArt)

        const genres = await fetch(`https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json&inc=genres`, {
            method: "GET",
            headers: {
                "User-Agent": "MyTarotation/1.0.0"
            }
        })
            .then(response => response.json())
            .then(data => {
                return data.genres.map(g => g.name)
            })
            .catch(err => console.log(err));

        let returnObject = {
            title: title,
            artist: artist,
            genres: genres,
            art: coverArt
        };

        const result = musicSchema.safeParse(returnObject);

        if (!result.success) {

            console.error("Validation Error:", result.error);

            throw new Error("Invalid musicApi response format");

        };

        console.log("Valid Music:", result.data);

        return result.data;

    } catch (error) {

        console.log("Error fetching Music details: " + error);

    };
}