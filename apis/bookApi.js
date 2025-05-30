import { z } from "zod";

export async function getBook(recommend) {
    try {

  

        let book = recommend
        let isbn = book?.isbnCode?.replace(/-/g, ""); 

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

    
        let bookDataResponse = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
   
        if (!bookDataResponse.ok) throw new Error(`Failed to fetch book data (ISBN: ${isbn})`);

        let bookData = await bookDataResponse.json();

        let key = bookData?.works?.[0]?.key;

        if (!key) {
            console.error(`Error: No work key found for ISBN: ${isbn}`);
            return null;
        }

      
        let blurbResponse = await fetch(`https://openlibrary.org${key}.json`);
        if (!blurbResponse.ok) throw new Error(`Failed to fetch work data (${key})`);

        let blurbData = await blurbResponse.json();

        console.log('Blurb:', blurbData)

        let description = blurbData?.description?.value ?? blurbData?.description ?? "No description available.";

        let genres = Array.isArray(blurbData?.subjects) && blurbData.subjects.length > 0 
            ? blurbData.subjects.slice(0, 3) 
            : ["Unknown Genre"];


        let bookObject = {
            title: blurbData?.title || "Unknown Title",
            art: blurbData?.covers?.[0]
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

    } catch (error) {
        console.error("🚨 Error getting book info:", error.message);
        return null;
    }
}
