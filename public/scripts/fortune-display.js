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

// Grid Div for fortune cards, cols is set to number of current columns
const cardGrid = document.querySelector('#card-grid')
let cols = 3;

// Card Backs
const cardBacks = document.querySelectorAll('.flip-card-back');

/* Lock Buttons On Cards
*   On Click:
*   - Toggle Card Border Colour between white and green
*   - Add or remove from Unlocked Type List Class List
*/
lockButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const typeToLock = this.classList[0];
        const cardToLock = document.querySelectorAll(`.${typeToLock}-card`);
        const deleteButtonToLock = document.querySelector(`.${typeToLock}#delete-btn`);
        unlockedTypesList.classList.toggle(`${typeToLock}`)
        deleteButtonToLock.classList.toggle('bg-red-500')
        deleteButtonToLock.classList.toggle('bg-gray-500')
        deleteButtonToLock.classList.toggle('border-red-500')
        deleteButtonToLock.classList.toggle('border-gray-500')
        deleteButtonToLock.classList.toggle('hover:bg-red-700')
        deleteButtonToLock.classList.toggle('hover:border-red-700')
        deleteButtonToLock.disabled = !deleteButtonToLock.disabled;
        cardToLock.forEach(side => {
            side.classList.toggle('border-emerald-500');
            side.classList.toggle('border-black');
        })
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
    const cardToDelete = document.querySelector(`#${this.value}-card-div`);
    cols -= 1;
    cardToDelete.classList.toggle('hidden');
    cardGrid.classList.toggle(`md:grid-cols-${cols}`);
    cardGrid.classList.toggle(`md:grid-cols-${cols + 1}`);
    screenCover.classList.toggle('hidden');
})

// On Click: Hide Confirm Deletion Pop Up
cancelDeleteButton.addEventListener('click', function (event) {
    screenCover.classList.toggle('hidden');
})

cardBacks.forEach(card => {
    card.addEventListener('mouseover', function(event) {
        const popUpType = this.classList[0].replace('-card','');
        const popUpShow = document.querySelector(`#${popUpType}-pop-up`);
        popUpShow.classList.toggle('hidden');
    })

    card.addEventListener('mouseout', function (event) {
        const popUpType = this.classList[0].replace('-card','')
        const popUpHide = document.querySelector(`#${popUpType}-pop-up`);
        popUpHide.classList.toggle('hidden');
    })
})



/**
 * > unlockedTypesList.classList
 * Gets array of media types that are not locked (as strings)
 */
unlockedTypesList.classList.forEach(type => {
    console.log(type);
})