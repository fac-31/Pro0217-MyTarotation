
export async function getBooks(recommend) {
    let books = (await recommend).bookRecommendations;
    let isbn = books[0].isbnCode;
    let title = books[0].title;
    let bookObject = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)
        .then(data => data.json())
        .then(async (data) => {
            let key = data.works[0].key.replace(/\/works\//, "")
            console.log(data, key)
            let blur = await fetch(`https://openlibrary.org/works/${key}.json`)
            return blur.json()
        })
    return console.log(title, isbn, bookObject.description)
}