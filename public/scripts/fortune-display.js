
// Lock, Delete and Pop Up Buttons
const lockButtons = document.querySelectorAll('#lock-btn');
const deleteButtons = document.querySelectorAll('#delete-btn');
const cancelDeleteButton = document.querySelector('#cancel-delete-btn');
const confirmDeleteButton = document.querySelector('#confirm-delete-btn');
const refreshButton = document.getElementById("refresh");
const _id = document.getElementById("fortune-display").getAttribute("uuid");

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
async function fetchUserData(_id) {
    try {
        const response = await fetch(`/get-user/${_id}`);
    
        if (!response.ok) {
            console.log(`Http error- Status: ${response.status}`);
        };

        const data = await response.json();

        console.log("User-data: ", data);

        return data;
    } catch (error) {
            console.error("Error getting data: ", error);
        };
};

async function saveUserData(userData) {
    try {
        const response = await fetch('/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({data: userData})
        });

        if (!response.ok) {
            throw new Error(`HTTP error - Status: ${response.status}`);
        };

        const result = await response.json();

        console.log("Server Response:", result);
    } catch (error) {

        console.error("Error saving user data:", error);
    }
}

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
confirmDeleteButton.addEventListener('click', async function (event) {
    const fortuneType = this.value;
    const cardToDelete = document.querySelector(`#${fortuneType}-card-div`);
    // Get user data from node-persist
    try {
        const userData = await fetchUserData(_id); 
        if (!userData) {
            throw new Error("No user data returned from the server.");
        }

        delete userData[fortuneType];
        // Save updated fortune
        await saveUserData(userData);

        // Hide card and change column number
        cols -= 1;
        cardToDelete.classList.toggle('hidden');
        cardGrid.classList.toggle(`md:grid-cols-${cols + 1}`);
        cardGrid.classList.toggle(`md:grid-cols-${cols}`);
        screenCover.classList.toggle('hidden');

        console.log(`Successfully deleted ${fortuneType} from user data.`);
    } catch (error) {
        console.error("Error during delete operation:", error);
    }
});

// On Click: Hide Confirm Deletion Pop Up
cancelDeleteButton.addEventListener('click', function (event) {
    screenCover.classList.toggle('hidden');
}); 

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

// Flashing cards to show you should turn them over - only shows once
document.addEventListener("DOMContentLoaded", () => {
    // Grab all the card containers
    const cardInners = document.querySelectorAll(".flip-card-inner");

    cardInners.forEach((cardInner) => {
    cardInner.addEventListener("click", () => {
        // If it's now flipped, remove the flashing class from the front
        if (cardInner.classList.contains("flipped")) {
        const frontSide = cardInner.querySelector(".flip-card-front");
        frontSide && frontSide.classList.remove("flash-border");
        }
    });
    });
});

// Function to update cards & update fortune upon refresh
async function updateCards(data, unlockedTypes) {
    
    let recommendations = data.recommendations;

    let prevRecommendations = await fetchUserData(_id);
    
    let fortune = {
        "_id": _id,
        "name": prevRecommendations.name,
        "starsign": prevRecommendations.starsign,
        "mood": prevRecommendations.mood,
        "books": typeof recommendations.books === "object" ? recommendations.books : prevRecommendations.books,
        "films": typeof recommendations.films === "object" ? recommendations.films : prevRecommendations.films,
        "albums":  typeof recommendations.albums === "object" ? recommendations.albums : prevRecommendations.albums            
        };

    unlockedTypes.forEach(elem => {

        fortune[elem] = recommendations[elem]?.[0];

        let card = document.getElementById(elem + "-card-div");

        let title = document.getElementById(elem + "-title");

        let imageMain = document.getElementById(elem + "-image-main");

        let imagePop = document.getElementById(elem + "-image-pop");

        let genres = document.getElementById(elem + "-genres");

        if (recommendations[elem].length === 0) {

            title.innerText = `Sorry, there are no ${elem} in your future`;

            genres.innerText = "";

            imageMain.style.backgroundImage = `url(https://via.placeholder.com/100x150?text=No+${elem}+Image})`;

            imagePop.src = "https://via.placeholder.com/100x150?text=No+${elem}+Image";

            if (elem === "albums") {
                let artist = document.getElementById(elem + "-artist");
                
                artist.innerText = ""
    
                } else {
                    let description = document.getElementById(elem + "-description");
                    
                    description.innerText = "";
    
                };
            } else {
                
                title.innerText = recommendations[elem][0].title;

                imageMain.style.backgroundImage = `url(${recommendations[elem][0].art ?? `https://via.placeholder.com/100x150?text=No+${elem}+Image`})`;
                
                imagePop.src = recommendations[elem][0].art ?? `https://via.placeholder.com/100x150?text=No+${elem}+Image}`;

                genres.innerText = (recommendations[elem][0].genres.join(", "));
            };

        card.style.visibility = "visible";

        card.classList.toggle("animate-deal");
        });
            
    await saveUserData(fortune, _id)
};

// Function that makes call to Open AI to get new recommendations. Takes the updateCards func upon the return of the data. 
// Passed to refresh button event listener.
let refresher = async () => {
    try {

        let unlockedTypes = [...unlockedTypesList.classList];

        let media = [];

        unlockedTypes.forEach(elem => {
            let card = document.getElementById(elem + "-card-div");

            card.classList.toggle("animate-deal");

            card.style.visibility = "hidden";

            let popUp = document.getElementById(elem + "-pop-up");

            media.push(popUp.querySelector("h4").textContent || "");
        });

        const response = await fetch('/refresh-data', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                types: unlockedTypes,
                titles: media
        })
        });

        await response.json().then((data) => updateCards(data, unlockedTypes));

    } catch (error) {
    console.error('Error fetching recommendations:', error);
}
}


// refresh button event listener
refreshButton.addEventListener("click", refresher) 
