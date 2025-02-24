
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

fetchImage()

// Fortune Form Submission
document.getElementById("fortuneForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const mood = document.getElementById("mood").value.trim();
    const recentWatch = document.getElementById("recentWatch").value.trim();

    try {
        const response = await fetch("/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, age, mood, recentWatch })
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerText = "Error: " + data.error;
        } else {
            document.getElementById("result").innerText = `
                Mood: ${data.mood}
                Film: ${data.filmRecommendations[0]?.title || "N/A"}
                TV Show: ${data.tvRecommendations[0]?.title || "N/A"}
                Book: ${data.bookRecommendations[0]?.title || "N/A"} (ISBN: ${data.bookRecommendations[0]?.isbnCode || "N/A"})
                Music: ${data.musicRecommendations[0]?.title || "N/A"} by ${data.musicRecommendations[0]?.artist || "N/A"}
            `;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerText = "Something went wrong!";
    }
});
