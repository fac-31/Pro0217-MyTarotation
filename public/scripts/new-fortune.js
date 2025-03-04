const submitButton = document.getElementById("submit-form");

const fortuneTellerImage = document.getElementById("fortuneteller-img");
const fortuneResult = document.getElementById("fortune-result");
const fortuneName = document.getElementById("name");
const fortuneAge = document.getElementById("age");
const fortuneMood = document.getElementById("mood");
const fortuneInterests = document.getElementById("interests");

const LOADING_IMG = "/FortuneTellerImages/gifs/CR-loading-eyesclosed.gif"

submitButton.addEventListener("click", event => {

    if (fortuneName.value && fortuneAge.value && fortuneMood.value && fortuneInterests.value) {
        fortuneTellerImage.src = LOADING_IMG;
    }

    
})