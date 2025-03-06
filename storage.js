import persist from 'node-persist';
import schedule from 'node-schedule'

// Creates storage with logging set to true. This will console log when an item is set, written etc
(async () => {
    await persist.init({ logging: true });
    let fortunes = await persist.getItem("fortunes");
    if (!fortunes) {
        await persist.setItem("fortunes", []);
    }
    console.log("📜 Stored Fortunes:", fortunes);
})();

export async function saveFortune(fortune) {
    try {
        let fortunes = await persist.getItem("fortunes") || []; 
        fortunes.push(fortune); 
        await persist.setItem("fortunes", fortunes); 
        console.log("New fortune saved:", fortune);
        return fortune;
    } catch (error) {
        console.error("Error saving fortune:", error.message);
    }
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
export async function clear() {
    try {
        return await persist.clear()
    } catch (error) {
        console.log("Error clearing storage: " + error.message)
    }
};

schedule.scheduleJob('0 0 * * *', clear)

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
        console.log(moods[mood]);
        console.log(moods[common]);
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

export async function getRandom() {
    try {
        let fortunes = await persist.getItem("fortunes");
        let num = Math.floor(Math.random() * fortunes.length);
        let selectedFortune = fortunes[num];
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