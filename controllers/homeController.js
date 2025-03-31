import { getCommonMood } from "../storage.js";

// Renders Home Page
export const getHomePage = async (req, res) => {
  let mood = await getCommonMood() + "";

  res.renderWithLayout(
    `
        <div class="flex flex-col items-center mt-10">
            <div id="greeting-container" class="bg-white rounded-full px-6 py-3 shadow-md h-16 flex items-center justify-center min-w-[280px]">
                <p id="greeting-text" class="text-blue-600 text-lg font-medium text-center">Hey there good looking</p>
            </div>
        </div>
        
        <div id="button-container" 
     class="grid grid-cols-2 gap-4 mt-8 mx-auto max-w-md opacity-0 transition-opacity duration-500">

  <a id="new-btn" href="/new"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200  px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
     Full Fortune Experience
  </a>

  <a id="random-btn" href="/random"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200  px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
    Express Fortune
  </a>

  <a id="mood-btn" href="/mood"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200 px-6 py-3 rounded-xl shadow-lg
            transform transition-transform duration-30 0 hover:-translate-y-1 hover:shadow-2xl">
    Pre-Coffee Fortune
  </a>

  <a href="" id="common-mood"
     class="bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-yellow-100 font-semibold text-center border border-yellow-200 px-6 py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
  </a>

</div>

        <script>
            function commonMoodButton() {
                let route = "/mood/${mood}";
                let link = document.getElementById("common-mood");
                link.href = route;
                link.innerText = "Everyone's feeling ${mood} today";
            }
            
            function animateGreetings() {
                const greetingText = document.getElementById("greeting-text");
                const greetingContainer = document.getElementById("greeting-container");
                const buttonContainer = document.getElementById("button-container");
                
                const messages = [
                    "Hey there, good looking!",
                    "I have been expecting you...",
                    "What guidance are you looking for today?"
                ];
                
                let currentMessage = 0;
                
                if (sessionStorage.getItem("homeClicked")) {
                    greetingText.textContent = messages[messages.length - 1];
                    buttonContainer.classList.remove("opacity-0"); // Show buttons immediately
                    return;
                }

                // Show the initial message
                greetingText.textContent = messages[currentMessage];
                
                // Function to display subsequent messages
                function displayNextMessage() {
                    // Fade out the current message
                    greetingContainer.classList.add("opacity-0");
                    
                    setTimeout(() => {
                        currentMessage++;
                        
                        // If we still have another message to show
                        if (currentMessage < messages.length) {
                            greetingText.textContent = messages[currentMessage];
                            greetingContainer.classList.remove("opacity-0");
                            
                            // If this is NOT the last message, schedule another transition
                            if (currentMessage < messages.length - 1) {
                                setTimeout(displayNextMessage, 2000);
                            } else {
                                // If it IS the last message, let it remain on screen,
                                // then reveal the buttons after a pause
                                setTimeout(() => {
                                    buttonContainer.classList.remove("opacity-0");
                                }, 2000);
                            }
                        }
                    }, 500); // 0.5s fade-out before switching to the next text
                }
                
                // Add transition class after initial render
                setTimeout(() => {
                    greetingContainer.classList.add("transition-opacity", "duration-500");
                    
                    // Start message transitions after 2 seconds
                    setTimeout(displayNextMessage, 2000);
                }, 100);
            }
            
            window.onload = function() {
                commonMoodButton();
                animateGreetings();
            };
        </script>
    `,
    { title: "Fortune Teller Home", useVideoBackground: true },
  );
};
