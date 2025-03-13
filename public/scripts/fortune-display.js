// Lock, Delete and Pop Up Buttons
const lockButtons = document.querySelectorAll('#lock-btn');
const deleteButtons = document.querySelectorAll('#delete-btn');
const cancelDeleteButton = document.querySelector('#cancel-delete-btn');
const confirmDeleteButton = document.querySelector('#confirm-delete-btn');

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
})

/**
 * > unlockedTypesList.classList
 * Gets array of media types that are not locked (as strings)
 */
unlockedTypesList.classList.forEach(type => {
    console.log(type);
})