import { randomImage } from "../utils/randomImage.js";


// Shared card layout
export const generateCardLayout = async (recommendations) => {
    const cards = [
        { type: 'movies', item: recommendations.movies?.[0] },
        { type: 'books', item: recommendations.books?.[0] },
        { type: 'albums', item: recommendations.albums?.[0] }
    ];
    let images = await randomImage();
    return `
    <button id="refresh">Refresh</button>
        <div id="card-grid" class="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto p-4">
            ${cards.map(({ type, item }, i) => `
                <div id="${type}-card-div" class="flip-card h-[450px] w-full min-w-[280px] opacity-0 animate-deal" >
                    <div id="${type}-card" class="flip-card-inner border-8 border-solid border-white rounded-lg">
                        <div class="flip-card-front shadow-lg overflow-hidden" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                            <img src="/Images/${images[i]}" alt="Tarot Card Back" class="w-full h-full object-cover">
                        </div>
                       <div class="flex flex-col justify-between flip-card-back bg-white shadow-lg p-6">
                            ${item ? `
                                <div class="flex flex-col items-center h-full" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                                    <img id="${type}-image" src="${item.art || `https://via.placeholder.com/100x150?text=No+${type}+Image`}" 
                                            alt="${type} cover" class="w-32 h-32 object-scale-down rounded-md mb-4">
                                    <h4 id="${type}-title" class="font-semibold text-center text-lg mb-2">${item.title}</h4>
                                    ${type === 'albums' ? `
                                        <p id="${type}-artist" class="text-md text-gray-600 mb-2">${item.artist}</p>
                                        <p id="${type}-genres" class="text-sm text-gray-500">Genres: ${item.genres.join(', ')}</p>
                                    ` : `
                                        <p id="${type}-genres" class="text-sm text-gray-600 mb-2">Genres: ${item.genres.join(', ')}</p>
                                        <p id="${type}-description" class="text-sm text-gray-500 text-center max-h-32 overflow-y-auto">${item.plot || item.description || ''}</p>
                                    `}
                                </div>
                                <div class="flex justify-between">
                                    <button id="lock-btn" type="button" class="${type} border-2 border-solid border-black rounded-sm">Lock</button>
                                    <button id="delete-btn"  type="button" class="${type} border-2 border-solid border-black rounded-sm">XXXX</button>
                                </div>
                            ` : `<p class="text-gray-500 text-center">No ${type} found</p>`}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div id="unlocked-types-list" class="movies books albums"></div>
        <div id="screen-cover" class="hidden absolute w-screen h-screen bg-transparent">
            <div id="confirm-delete" class="absolute bg-white p-8">
                <p>Confirm that you would like to delete this recommendation from your fortune</p>
                <p>AND that you do not want to recieve any more recommendations of this type</p>
                <button id="cancel-delete-btn" type="button" class="bg-grey-500">Cancel</button>
                <button id="confirm-delete-btn" type="button" class="bg-red-500" value="">Confirm Deletion</button>
            </div>
        </div>
        <style>
            .flip-card {
                perspective: 1000px;
                cursor: pointer;
            }
            .flip-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s;
                transform-style: preserve-3d;
            }
            .flip-card-inner.flipped {
                transform: rotateY(180deg);
            }
            .flip-card-front, .flip-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
            }
            .flip-card-back {
                transform: rotateY(180deg);
            }
            #unlocked-types-list {
                display: none;
            }
        </style>
        <script type="module" src="./scripts/fortune-display.js"></script>
    `;
}

