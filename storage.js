import persist from 'node-persist';

// Creates storage with logging set to true. This will console log when an item is set, written etc
(async () => {
    await persist.initSync({ logging: true });
    await persist.setItem("fortunes", [
        {
            "name": "Red Hellier",
            "starsign": "Aries",
            "mood": "Happy",
            "book": {
                "title": "Twilight",
                "author": "Stephenie Meyer",
                "ISBN": "0316015849",
                "art": "https://covers.openlibrary.org/b/id/twilight-S.jpg",
                "description": "Book about sexy vampires",
                "genres": ["Romance","Drama"]
            },
            "film": {
                "title": "Pirates of the Carribean 3: At World's End",
                "plot": "The Pirates fight for love and life in this epic finale",
                "genres": ["Action","Adventure"],
                "art": "--filmposter poster url"
            },
            "album": {
                "title": "The Rise and Fall of a Midwest Princess",
                "artist": "Chappell Roan",
                "genres": ["Pop"],
                "art": "--album cover art url"
            }
        },
        {
            "name": "Billy Bob",
            "starsign": "Scorpio",
            "mood": "Reflective",
            "book": {
                "title": "Dune",
                "author": "Frank Herbert",
                "isbnCode": "0316015849",
                "art": "https://covers.openlibrary.org/b/id/twilight-S.jpg",
                "description": "It's in the desert in space",
                "genres": ["Sci-fi","Drama"]
            },
            "film": {
                "title": "Mad Max: Fury Road",
                "plot": "A desert car chase",
                "genres": ["Action","Adventure"],
                "art": "--filmposter poster url"
            },
            "album": {
                "title": "To Pimp a Butterfly",
                "artist": "Kendrick Lamar",
                "genres": ["HipHop","Jazz"],
                "art": "--album cover art url"
            }
        }
    ])
})();

// Function to add users. We may not need to store this as I don't think we resuse this info but we may want to in the future 
export async function saveUser(name, age, mood, recommendations) {
    try {
        const userData = { name, age, mood, recommendations};

        return await persist.setItem(name, userData);
    } catch (error) {
        console.log("Error setting user: " + error.message)
    }
  };

// Clears all stored data
export async function clear() {
    try {
        return await persist.clear()
    } catch (error) {
        console.log("Error clearing storage: " + error.message)
    }
};

// Saves moods and their popularity to access for the random mood call
export async function saveMoods(mood) {
    try {
        let moods = await persist.getItem('moods');

        if (!moods) {
        moods = {};
        };

        moods[mood] = moods[mood] ? moods[mood] + 1 : 1;

        return await persist.setItem('moods', moods);
    } catch (error) {
    console.log("Error setting mood: " + error.message)
    };
};

export async function getCommonMood() {
    try {
    let moods = await persist.getItem("moods");
    let common = "happy"; 
    for (const mood in moods) {
         if (moods[mood] > moods[common]) {
            common = mood;
         };
    };
    return common;
    } catch (error) {
        console.log("Error fetching common mood: " + error.message);
    };
};

export async function getRandomMoodFortune(mood) {
    try {
        let fortunes = await persist.getItem("fortunes");
        let moodFortunes = fortunes.filter(x => x.mood === mood);
        let num = Math.floor(Math.random() * moodFortunes.length);
        let selectedFortune = moodFortunes[num];
        return selectedFortune;
    } catch (error) {
        console.log("Error fetching common mood fortune: " + error.message)
    }
}

export async function retrieveItem(item) {
    try {
        let data = await persist.getItem(item);
        return data
    } catch (error) {
        console.log("Error getting item :" + error.message)
    };
};