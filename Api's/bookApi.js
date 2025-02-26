import { z } from "zod";

export async function getBook(recommend) {

    let books = recommend.bookRecommendations;

    let isbn = books[0].isbnCode;

    let bookSchema = z.object({
        title: z.string(),
        art: z.string(),
        description: z.string(),
        genres: z.array(z.string())
    });

    try {

    let bookObject = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)
        .then(data => data.json())
        .then(async (data) => {
            // The isbn api does not have a description property. If we want this, we need to get the Open Library code for the works api
            // We get that below
            let key = data.works[0].key // this is /works/OL1234567

            let blurb = await fetch(`https://openlibrary.org${key}.json`)
                .then(response => response.json())
                .then(data => {

                    let description = typeof data.description === "string" ? data.description : data.description.value;

                    let returnObject = {
                        title: data.title,
                        art: `https://covers.openlibrary.org/b/id/${data.covers[0]}-S.jpg`,
                        description: description,
                        genres: data.subjects
                    };
                    return returnObject;
                });
                return blurb
        });

        const result = bookSchema.safeParse(bookObject);

        if (!result.success) {

            console.error("Validation Error:", result.error);

            throw new Error("Invalid bookApi response format");

        };

        console.log("Valid Book:", result.data);

        return result.data;

    } catch (error) {

        console.log("Error getting Book info: " + error);

        return null;

    };
};

