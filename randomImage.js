import fs from "fs"

export async function randomImage() {
    // Use readdir to get array of Image files from Images directory. import.meta.dirname === __dirname
    try {
        let images = await fs.promises.readdir(import.meta.dirname  + '/Images');
        if (images.length === 0) {
            throw new Error("No images found");
        } else {
            // Gets random Image file
            let num = Math.floor(Math.random() * images.length);
            return images[num];
        };
    } catch(error) {
        console.error("Error:", error.message);
        return null;
    }
};