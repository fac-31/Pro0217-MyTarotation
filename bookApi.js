// Book recommender api call
export async function getBooks(recommend) {
    // Calls the openAi api function that passed as a parameter. This is only here while testing. We will call it once and store 
    // the data before passing that data to the individual apis. 
    let books = (await recommend).bookRecommendations;
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
            // Return the works book object that includes description as Json object
            return blurb.json()
        })
    return title, isbn, bookObject
}