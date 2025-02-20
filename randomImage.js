import fs from "fs";
import path from "path";


export async function randomImage() {
    try {

        const imagesDir = path.join(import.meta.dirname, 'public', 'Images');
        let images = await fs.promises.readdir(imagesDir);
        
        if (images.length === 0) {
            throw new Error("No images found");
        } else {
            // Select a random image file
            let num = Math.floor(Math.random() * images.length);
            const selectedImage = images[num];

            // Return the relative URL for the image (since it's inside the public directory)
            return `/Images/${selectedImage}`;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}
