'use strict';
const checkBtn = document.querySelector('.check')
const message = document.querySelector('.message')
const scoreElement = document.querySelector('.score')
const highscoreDom = document.querySelector('.highscore')
const secretNumberEL = document.querySelector('.number')
const guess = document.querySelector('.guess')
const againBtn = document.querySelector('.again');

let secretNumber;
let currentScore;
let highscore = 0;
let gameover;
reset()
checkBtn.addEventListener('click', guessNumber)
againBtn.addEventListener('click',reset)

function guessNumber() {
    if (!gameover) {
        console.log(currentScore);
        let guessNum = Number(guess.value);
        if ((currentScore >=2)||(guessNum == secretNumber)) {   
            if (!guess.value) {
                message.textContent = `No Number`
            }
            else if((guessNum == secretNumber)) {
                message.textContent = 'correct'
                gameover = true
                document.querySelector('body').style.backgroundColor = "green";
                secretNumberEL.innerHTML = secretNumber;
                highscore = currentScore > highscore ? currentScore : highscore;
                highscoreDom.textContent = highscore;
            }
            else if (guessNum != secretNumber) {
                message.textContent = (guessNum > secretNumber) ? `👆too high` : `👇too low`;
                currentScore--;
            }
            scoreElement.textContent = currentScore;
        }
        else {
            gameover = true;
            scoreElement.textContent = currentScore-1;
            message.textContent = 'Gameover😭'
            document.querySelector('body').style.backgroundColor = "red";
            secretNumberEL.innerHTML = secretNumber;
        }
       
    }
}
function reset() {
    gameover = false;
    currentScore = 20;
    secretNumber = Math.floor(Math.random() * 20) + 1;
    console.log(secretNumber);
    document.querySelector('body').style.backgroundColor = "#222";
    guess.value = '';
    scoreElement.textContent = currentScore;
    secretNumberEL.innerHTML = '?';
    message.textContent = `Start guessing...`
}