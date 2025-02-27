
async function fetchImage() {
    try {
        const response = await fetch('/get-image');
        const data = await response.json();
        const imageUrl = data.imageUrl;

        if (imageUrl) {
            const imageElement = document.getElementById('fortuneteller-img');
            imageElement.src = imageUrl;
        } else {
            console.error("Image not found");
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

fetchImage();
function validateForm() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;

    if (!username.trim() || !email.trim()) {
        alert("Please fill in all fields.");
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}