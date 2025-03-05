const submitButton = document.getElementById("submit-form");

const fortuneTellerImage = document.getElementById("fortuneteller-img");
const moodSelect = document.getElementById("mood");

const LOADING_IMG = "/FortuneTellerImages/gifs/CR-loading-eyesclosed.gif";

submitButton.addEventListener("click", event => {
    console.log(moodSelect.value !== '')
    if (moodSelect.value !== '') {
        fortuneTellerImage.src = LOADING_IMG;
    }
})