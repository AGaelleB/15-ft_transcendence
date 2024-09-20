// frontend/srcs/js/resizeCanvas.js

import { gameSettings } from './gameSettings.js';

export function resizeCanvas(canvas, paddleLeft, paddleRight, ball, aspectRatio = 16 / 9) {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;

    // Calculate the new canvas size based on the aspect ratio
    if (containerWidth / containerHeight < aspectRatio) {
        canvas.width = containerWidth * 0.9;
        canvas.height = canvas.width / aspectRatio;
    } else {
        canvas.height = containerHeight * 0.9;
        canvas.width = canvas.height * aspectRatio;
    }

    // Adjust paddle and ball sizes
    paddleLeft.width = canvas.width * gameSettings.paddleWidth;
    paddleLeft.height = canvas.height * gameSettings.paddleHeight;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = canvas.width * gameSettings.ballSize;

    // Update paddle positions
    paddleLeft.y = canvas.height / 2 - paddleLeft.height / 2;
    paddleRight.x = canvas.width - paddleRight.width;
    paddleRight.y = canvas.height / 2 - paddleRight.height / 2;

    // Update ball position
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Update canvas border size
    canvas.style.border = `${Math.max(canvas.width * 0.015, 6)}px solid #a16935`;

    // Adjust paddle and ball speed based on canvas size
    window.paddleSpeed = canvas.height * gameSettings.paddleSpeed;
    window.ballSpeedX = canvas.width * gameSettings.ballSpeedX;
    window.ballSpeedY = canvas.height * gameSettings.ballSpeedY;

    // Apply the new speed to the ball
    ball.dx = window.ballSpeedX;
    ball.dy = window.ballSpeedY;
}
