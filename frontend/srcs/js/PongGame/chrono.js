// frontend/srcs/js/chrono.js

import { isGameOver } from './score.js';

// Fonction pour gérer le chrono avant le lancement de la balle
export function startCountdown(callback) {
    if (isGameOver())
        return;
    const countdownElement = document.getElementById('countdown');
    let count = 3;

    countdownElement.style.display = 'block';
    countdownElement.innerHTML = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.innerHTML = count;
        }
        else if (count === 0) {
            countdownElement.innerHTML = 'GO!';
        }
        else {
            clearInterval(interval);
            countdownElement.style.display = 'none';
            callback();
        }
    }, 500);
}