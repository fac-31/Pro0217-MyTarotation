const lockButtons = document.querySelectorAll('#lock-btn');
const deleteButtons = document.querySelectorAll('#delete-btn');

const movieCard = document.querySelector('#movie-card');
const bookCard = document.querySelector('#book-card');
const albumCard = document.querySelector('#album-card');

const lockedBorder = ['border-8', 'border-solid', 'border-emerald-500', 'rounded-lg']

lockButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const cardToLock = document.querySelector(`#${this.classList[0]}-card`);
        cardToLock.classList.toggle('locked');
        cardToLock.classList.toggle('border-emerald-500');
        cardToLock.classList.toggle('border-white');
    })
});

deleteButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const cardToDelete = document.querySelector(`#${this.classList[0]}-card-div`);
        cardToDelete.classList.add('hidden');
    })
});