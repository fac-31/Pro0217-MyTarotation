// Buttons
const submitButton = document.getElementById("submit-form");
const nextButton = document.getElementById("next-section");
const changeSignInputButton = document.getElementById("change-sign-input-type");

// Image
const fortuneTellerImage = document.getElementById("fortuneteller-img");

// Form
const fortuneForm = document.getElementById("fortune-form");
const formSectionOne = document.getElementById("form-section-1")
const formSectionTwo = document.getElementById("form-section-2")

// Input Divs and currently displayed div
let currentInput = "Date of Birth";
const starsignDropdownDiv = document.getElementById("starsign-dropdown");
const dobDateDiv = document.getElementById("dob-date");

// Input Fields
const fortuneName = document.getElementById("name");
const fortuneDoB = document.getElementById("dob");
const fortuneSign = document.getElementById("starsign");
fortuneSign.value = fortuneSign.defaultValue;
const fortuneMood = document.getElementById("mood");
const fortuneInterests = document.getElementById("interests");

// Path to loading image
const LOADING_IMG = "/FortuneTellerImages/gifs/CR-loading-eyesclosed.gif";

/**
 * Sets two divs to either hidden or displayed
 * @param {HTMLDivElement} swapFrom - the input div to hide
 * @param {HTMLDivElement} swapTo - the input div to show
 */
const swapInput = (swapFrom,swapTo) => {
    swapFrom.classList.remove("block");
    swapFrom.classList.add("hidden");
    swapTo.classList.remove("hidden");
    swapTo.classList.add("block");
}

// When the "Use *" button is clicked
changeSignInputButton.addEventListener("click", event => {

    // Change the text of the button to the old input type
    changeSignInputButton.innerText = `Use ${currentInput}`

    // Swap which input div is displayed
    if (currentInput === "Date of Birth") {
        currentInput = "Starsign";
        fortuneDoB.value = fortuneDoB.defaultValue;
        swapInput(dobDateDiv,starsignDropdownDiv);
    } else {
        currentInput = "Date of Birth";
        fortuneSign.value = fortuneSign.defaultValue;
        swapInput(starsignDropdownDiv,dobDateDiv);
    }
})

nextButton.addEventListener("click", event => {
    if (fortuneName.value && (fortuneDoB.value || fortuneSign.value) && fortuneMood.value) {
        formSectionOne.classList.toggle("hidden");
        formSectionTwo.classList.toggle("hidden");
    }
})

/**
 * Form Submit Event
 * Checks if all the fields have been filled:
 *      name
 *      either DoB or Starsign
 *      mood
 *      interests
 * 
 * If true, changes the fortune teller image to loading
 * If false, prevents the form submission
 */
fortuneForm.addEventListener("submit", event => {
    if (fortuneInterests.value) {
        fortuneTellerImage.src = LOADING_IMG;
    } else {
        event.preventDefault();
    }
})