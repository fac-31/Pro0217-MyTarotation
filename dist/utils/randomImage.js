var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filePath);
export function randomImage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(__filePath, __dirname);
            const imagesDir = path.join(__dirname, '..', '..', 'public', 'Images', 'CardImages');
            let images = yield fs.promises.readdir(imagesDir);
            if (images.length === 0) {
                throw new Error("No images found");
            }
            else {
                // Select a random image file
                let three = new Set();
                while (three.size < 3) {
                    let num = Math.floor(Math.random() * images.length);
                    three.add(images[num]);
                }
                // Return the relative URL for the image (since it's inside the public directory)
                return Array.from(three);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            }
            return null;
        }
    });
}
