import { randomImage } from "../utils/randomImage.js";


// Shared card layout
export const generateCardLayout = async (recommendations) => {
    const cards = [
        { type: 'movies', item: recommendations.movies?.[0] },
        { type: 'books', item: recommendations.books?.[0] },
        { type: 'albums', item: recommendations.albums?.[0] },
      
    ];



    let images = await randomImage();
    return `
    ${recommendations.warning ? `<div class="text-red-500 font-semibold text-center mb-4">${recommendations.warning}</div>` : ''}
    <button id="refresh">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
</button>
    <div id="card-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-4" style="grid-auto-rows: minmax(270px, auto); grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
      ${cards.map(({ type, item }, i) => `
          <div id="${type}-card-div" class="flip-card w-full opacity-0 animate-deal">
              <h1 class="text-center font-bold">${type.toUpperCase()}</h1>
              <div id="${type}-card" class="flip-card-inner">
                  <div class="flex justify-between w-full fixed -top-6">
                      <button id="lock-btn" type="button" class="${type} bg-emerald-500 border-2 border-solid border-emerald-500 rounded-sm p-4 hover:bg-emerald-600 hover:border-emerald-600"></button>
                      <button id="delete-btn" type="button" class="${type} bg-red-500 border-2 border-solid border-red-500 rounded-sm p-4 hover:bg-red-700 hover:border-red-700"></button>
                  </div>
                  <div class="${type}-card flip-card-front shadow-lg overflow-hidden border-4 border-solid border-black rounded-lg" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                      <img src="/Images/${images[i]}" alt="Tarot Card Back" class="w-full h-full object-cover">
                  </div>
                  <div class="${type}-card flip-card-back flex flex-col justify-between border-4 border-solid border-black rounded-lg">
                      ${item ? `
                          <div id="${type}-image-main" class="flex flex-col items-center h-full bg-cover" style="background-image: url(${item?.art || `https://via.placeholder.com/100x150?text=No+${type}+Image`}); background-position: center;" onclick="document.querySelector('#${type}-card.flip-card-inner').classList.toggle('flipped')">
                          </div>
                      ` : `<p class="text-gray-500 text-center">No ${type} found</p>`}
                  </div>
              </div>
          </div>
    
                <div id="${type}-pop-up" class="fixed hidden end-40 w-1/4 min-w-[500px] inset-y-40 h-1/3 bg-white flex justify-between z-20 border-4 border-solid border-black rounded-lg">
                    <div class="grow-0">
                        <img id="${type}-image-pop" src="${item?.art || `https://via.placeholder.com/100x150?text=No+${type}+Image`}" alt="${type} cover" class="w-32 h-32 object-scale-down rounded-md mb-4">
                    </div>
                    <div class="grow flex flex-col justify-around items-center">
                        <h4 id="${type}-title" class="font-semibold text-center text-lg mb-2">${item?.title || `No ${type} found in your future.`}</h4>
                        ${type === 'album' ? `
                            <p id="${type}-artist" class="text-md text-gray-600 mb-2">${item?.artist}</p>
                            <p id="${type}-genres" class="text-sm text-gray-500">Genres: ${item?.genres.join(', ')}</p>
                        ` : `
                            <p id="${type}-genres" class="text-sm text-gray-600 mb-2">Genres: ${item?.genres.join(', ')}</p>
                            <p id="${type}-description" class="text-sm text-gray-500 text-center max-h-32 overflow-y-auto">${item?.plot || item?.description || ''}</p>
                        `}
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
            .card-title {
                backface-visibilty: hidden;
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

