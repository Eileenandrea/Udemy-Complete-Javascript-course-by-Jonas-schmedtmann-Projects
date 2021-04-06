'use strict';

let dice = document.querySelector('.dice');

const score0EL = document.querySelector('#score--0');
const score1EL = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const player0EL = document.querySelector('.player--0')
const player1EL = document.querySelector('.player--1')

const btnHold = document.querySelector('.btn--hold');
const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
let currentScore, activePlayer;
var score = []
var playing 

function initialize() {

    score = [0,0]
    currentScore = 0;
    activePlayer = 0;

    score0EL.textContent = score[0];
    score1EL.textContent = score[1];
    current0El.textContent = currentScore;
    current1El.textContent = currentScore;
    dice.classList.add('hidden');
    document
        .querySelector(`.player--${0}`).classList.remove('player--winner');
    document
        .querySelector(`.player--${1}`).classList.remove('player--winner');
    document
            .querySelector(`.player--${activePlayer}`).classList.add('player-active');
    playing = true;

}
let number1

const rollDice = function () {
    if (playing) {
        dice.classList.remove('hidden');
        let i = Math.trunc(Math.random() * 6) + 1
        dice.src = `dice-${i}.png`
        if (i !== 1) {
            currentScore = currentScore + i;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore
        }
        else {
       
            changeActivePlayer();
        
        }
    }
} 

function changeActivePlayer() {
    currentScore = 0;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    document.querySelector(`player--${activePlayer}`)
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0EL.classList.toggle('player--active');
    player1EL.classList.toggle('player--active');
}

function addScore() {//add Current score of current player to the Total Score.
    if (playing) {
        score[activePlayer] = score[activePlayer] + currentScore;
        console.log(score[activePlayer]);
        document.getElementById(`score--${activePlayer}`).textContent = score[activePlayer];
        checkWinner();
    }
  
}
function checkWinner() {
    //Check if someone already wins the game.
    if (score[activePlayer] >= 20) {
        document
            .querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        document
            .querySelector(`.player--${activePlayer}`).classList.add('player-active');
        playing = false;
        
    }
    else { 
        changeActivePlayer();
    }
}

initialize();
btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', addScore);
btnNew.addEventListener('click', initialize);