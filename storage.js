import persist from 'node-persist';

// Creates storage with logging set to true. This will console log when an item is set, written etc
(async () => {
    await persist.initSync({ logging: true });
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
}

export async function getCommonMood() {
    let moods = await persist.getItem("moods");
    let common = "Happy"; 
    for (const mood in moods) {
         if (moods[mood] > moods[common]) {
            common = mood;
         };
    };
    return common
 
}

export async function retrieveItem(item) {
    try {
        let data = await persist.getItem(item);
        return data
    } catch (error) {
        console.log("Error getting item :" + error.message)
    };
};