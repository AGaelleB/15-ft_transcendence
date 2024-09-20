// frontend/srcs/js/computerIA.js

import { gameSettings } from './gameSettings.js';

export function moveComputerPaddle(ball, paddleRight) {
    const aiSpeed = window.paddleSpeed * gameSettings.aiSpeedFactor;

    if (ball.x > gameSettings.canvasWidth / 2) {
        const centerOfPaddle = paddleRight.y + paddleRight.height / 2;

        // AI paddle moves at a percentage of the player's speed
        if (ball.y > centerOfPaddle)
            paddleRight.y += aiSpeed;
        else
            paddleRight.y -= aiSpeed;

        // Prevent the AI paddle from going out of bounds
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        else if (paddleRight.y > gameSettings.canvasHeight - paddleRight.height)
            paddleRight.y = gameSettings.canvasHeight - paddleRight.height;
    }
}
