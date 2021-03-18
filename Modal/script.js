'use strict';
let modal = document.querySelector('.modal')
let overlay = document.querySelector('.overlay')
let btnCloseModal = document.querySelector('.close-modal')
let showModalBtn = document.querySelectorAll('.show-modal')


for (let i = 0; i < showModalBtn.length; i++) {
    showModalBtn[i].addEventListener('click', showmodal)
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

function showmodal() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden')
}

function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden')
}
document.addEventListener('keydown', function (e) {
    let keypress = e.key;
    if (keypress === `Escape`) {
        if (!modal.classList.contains('hidden')) {
            closeModal();
        }
    }
})