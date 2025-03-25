import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filePath: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filePath) 

export async function randomImage(): Promise<string[] | null>  {
    try {
        console.log(__filePath, __dirname)

        const imagesDir: string = path.join(__dirname, '..', '..', 'public', 'Images', 'CardImages');

        let images: string[] = await fs.promises.readdir(imagesDir);
        
        if (images.length === 0) {
            throw new Error("No images found");
        } else {
            // Select a random image file
            let three = new Set<string>();

            while (three.size < 3) {
                let num: number = Math.floor(Math.random() * images.length);
                three.add(images[num]);
            }

            // Return the relative URL for the image (since it's inside the public directory)
            return Array.from(three);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
        console.error("Error:", error.message);
        }
        return null;
    }
}
