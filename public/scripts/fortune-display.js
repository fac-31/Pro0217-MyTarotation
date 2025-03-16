// Lock, Delete and Pop Up Buttons
const lockButtons = document.querySelectorAll('#lock-btn');
const deleteButtons = document.querySelectorAll('#delete-btn');
const cancelDeleteButton = document.querySelector('#cancel-delete-btn');
const confirmDeleteButton = document.querySelector('#confirm-delete-btn');
const refreshButton = document.getElementById("refresh");

// Pop up to confirm recommendation delete and prevent clicking on main page
const confirmDeletePopUp = document.querySelector('#confirm-delete');
const screenCover = document.querySelector('#screen-cover');

// Div that stores the unlocked types list
const unlockedTypesList = document.querySelector('#unlocked-types-list')

// Cards
const movieCard = document.querySelector('#movie-card');
const bookCard = document.querySelector('#book-card');
const albumCard = document.querySelector('#album-card');

/* Lock Buttons On Cards
*   On Click:
*   - Toggle Card Border Colour between white and green
*   - Toggle locked Card Class
*   - Add or remove from Unlocked Type List Class List
*/
lockButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const typeToLock = this.classList[0];
        const cardToLock = document.querySelector(`#${typeToLock}-card`);
        cardToLock.classList.toggle('locked');
        unlockedTypesList.classList.toggle(`${typeToLock}`)
        cardToLock.classList.toggle('border-emerald-500');
        cardToLock.classList.toggle('border-white');
    })
});

/* Delete Buttons On Cards
*   On Click:
*   - Show Confirm Deletion Pop Up
*   - Set the Value of the Confirm Delete Button to the selected media type
*/
deleteButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const typeToDelete = this.classList[0];
        screenCover.classList.toggle('hidden');
        confirmDeleteButton.value = `${typeToDelete}`;
    })
});

/* Confirm Delete Button
*   On Click:
*   - Hide Confirm Deletion Pop Up
*   - Hide Card of selected Type
*   - TODO: Get fortune set from Node persist and delete selected type
            Change Column number for cards
*/
confirmDeleteButton.addEventListener('click', function (event) {
    const cardToDelete = document.querySelector(`#${this.value}-card`);
    cardToDelete.classList.toggle('hidden');
    screenCover.classList.toggle('hidden');
})

// On Click: Hide Confirm Deletion Pop Up
cancelDeleteButton.addEventListener('click', function (event) {
    screenCover.classList.toggle('hidden');
}); 


// Create api route for refresh. Then a function 
// to input this into the html. Check styling and done.
let refresher = async () => {
    try {

        let unlockedTypes = [...unlockedTypesList.classList];

        let media = [];

        unlockedTypes.forEach(elem => {
            let card = document.getElementById(elem + "-card-div");

            card.style.visibility = "hidden";

            media.push(card.querySelector("h4").textContent || "");
        });

        const response = await fetch('/refresh-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                types: unlockedTypes,
                titles: media
        })
        });

        await response.json().then(data => {
            let recommendations = data.recommendations;
            console.log(recommendations)
            unlockedTypes.forEach(elem => {

                let card = document.getElementById(elem + "-card-div");

                let title = document.getElementById(elem + "-title");
                title.innerText = recommendations[elem][0].title;

                let image = document.getElementById(elem + "-image");
                image.src = recommendations[elem][0].art;

                let genres = document.getElementById(elem + "-genres");
                genres.innerText = (recommendations[elem][0].genres.join(", "))

                if (elem === "album") {

                    let artist = document.getElementById(elem + "-artist");
                    artist.innerText = recommendations[elem][0].artist;

                } else {
                    
                    let description = document.getElementById(elem + "-description");
                    description.innerText = recommendations[elem][0]["plot" || "description"];

                };
                card.style.visibility = "visible";
            });

        })
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// refresh button event listener
refreshButton.addEventListener("click", refresher) 