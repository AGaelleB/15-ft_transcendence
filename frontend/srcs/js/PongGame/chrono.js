// frontend/srcs/js/PongGame/chrono.js

import { isGameOver } from './Game2D/score2D.js';
import { isGameOver3D } from './Game3D/score3D.js';

export function startCountdown(callback) {
    if (isGameOver() || isGameOver3D()) {
        console.log("GAME OVER");
        return;
    }
    const countdownElement = document.getElementById('countdown');
    let count = 3;

    countdownElement.style.display = 'block';
    countdownElement.innerHTML = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0)
            countdownElement.innerHTML = count;
        else if (count === 0)
            countdownElement.innerHTML = 'GO!';
        else {
            clearInterval(interval);
            countdownElement.style.display = 'none';
            callback();
        }
    }, 500);
}