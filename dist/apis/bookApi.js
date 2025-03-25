var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from "zod";
export function getBook(recommend) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            let book = recommend;
            let isbn = (_a = book === null || book === void 0 ? void 0 : book.isbnCode) === null || _a === void 0 ? void 0 : _a.replace(/-/g, "");
            if (!isbn) {
                console.error("Error: Missing ISBN code.");
                return null;
            }
            let bookSchema = z.object({
                title: z.string(),
                art: z.string(),
                description: z.string(),
                genres: z.array(z.string())
            });
            let bookDataResponse = yield fetch(`https://openlibrary.org/isbn/${isbn}.json`);
            if (!bookDataResponse.ok)
                throw new Error(`Failed to fetch book data (ISBN: ${isbn})`);
            let bookData = yield bookDataResponse.json();
            let key = (_c = (_b = bookData === null || bookData === void 0 ? void 0 : bookData.works) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.key;
            if (!key) {
                console.error(`Error: No work key found for ISBN: ${isbn}`);
                return null;
            }
            let blurbResponse = yield fetch(`https://openlibrary.org${key}.json`);
            if (!blurbResponse.ok)
                throw new Error(`Failed to fetch work data (${key})`);
            let blurbData = yield blurbResponse.json();
            console.log('Blurb:', blurbData);
            let description = (_f = (_e = (_d = blurbData === null || blurbData === void 0 ? void 0 : blurbData.description) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : blurbData === null || blurbData === void 0 ? void 0 : blurbData.description) !== null && _f !== void 0 ? _f : "No description available.";
            let genres = Array.isArray(blurbData === null || blurbData === void 0 ? void 0 : blurbData.subjects) && blurbData.subjects.length > 0
                ? blurbData.subjects.slice(0, 3)
                : ["Unknown Genre"];
            let bookObject = {
                title: (blurbData === null || blurbData === void 0 ? void 0 : blurbData.title) || "Unknown Title",
                art: ((_g = blurbData === null || blurbData === void 0 ? void 0 : blurbData.covers) === null || _g === void 0 ? void 0 : _g[0])
                    ? `https://covers.openlibrary.org/b/id/${blurbData.covers[0]}-M.jpg`
                    : "https://via.placeholder.com/100x150?text=No+Cover",
                description: description,
                genres: genres.map(genre => genre.toLowerCase())
            };
            const result = bookSchema.safeParse(bookObject);
            if (!result.success) {
                console.error("Validation Error:", result.error);
                throw new Error("Invalid bookApi response format");
            }
            return result.data;
        }
        catch (error) {
            console.error("🚨 Error getting book info:", error.message);
            return null;
        }
    });
}
