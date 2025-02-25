// Book recommender api call
export async function getBooks(recommend) {
    // Changed so recommend is the object returned from openai call
    let books = recommend.bookRecommendations;
    // We use the isbn code to make a call to the open library api. This is an internationally recognised code. 
    let isbn = books[0].isbnCode;
    // Get title to check if the returned book is the same as that returned by OpenAi
    let title = books[0].title;
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
                        art: data.covers[0],
                        description: description
                    };
                    return returnObject;
                });
                return blurb
        });
        return bookObject
}

