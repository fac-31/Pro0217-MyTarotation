const submitButton = document.getElementById("submit-form");

const fortuneTellerImage = document.getElementById("fortuneteller-img");
const fortuneResult = document.getElementById("fortune-result");
const fortuneName = document.getElementById("name");
const fortuneAge = document.getElementById("age");
const fortuneMood = document.getElementById("mood");
const fortuneInterests = document.getElementById("interests");

submitButton.addEventListener("click", event => {

    if (fortuneName.value && fortuneAge.value && fortuneMood.value && fortuneInterests.value) {
        // change image to loading
        fortuneResult.style.display = "block";
        fortuneResult.innerHTML = '<p>Loading</p>';
    } else {
        //change image to need more info? do nothing?
        fortuneResult.style.display = "block";
        fortuneResult.innerHTML = '<p>Please Enter All Data</p>'
    }

    
})