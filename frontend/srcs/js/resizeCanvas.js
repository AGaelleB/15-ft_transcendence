// frontend/srcs/js/resizeCanvas.js
import { gameSettings } from './gameSettings.js';

export function resizeCanvas(paddleLeft, paddleRight, ball) {
    const canvas = document.getElementById('pongCanvas');
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;
    const aspectRatio = gameSettings.aspectRatio;

    // Calculate the new canvas size based on the aspect ratio
    let canvasWidth, canvasHeight;
    if (containerWidth / containerHeight < aspectRatio) {
        canvasWidth = containerWidth * gameSettings.canvasWidthFactor;
        canvasHeight = canvasWidth / aspectRatio;
    } else {
        canvasHeight = containerHeight * gameSettings.canvasWidthFactor;
        canvasWidth = canvasHeight * aspectRatio;
    }

    // Apply the calculated size to the canvas
    canvas.width = Math.min(canvasWidth, gameSettings.canvasWidth);
    canvas.height = Math.min(canvasHeight, gameSettings.canvasHeight);

    // Calculate border size dynamically based on gameSettings
    const borderSize = `${Math.max(canvas.width * gameSettings.borderFactor, gameSettings.minBorderSize)}px solid ${gameSettings.borderColor}`;
    canvas.style.border = borderSize;

    // Adjust paddle sizes and positions using factors from gameSettings
    paddleLeft.width = canvas.width * gameSettings.paddleWidthFactor;
    paddleLeft.height = canvas.height * gameSettings.paddleHeightFactor;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = canvas.width * gameSettings.ballSizeFactor;

    // Position paddles at the borders of the canvas
    paddleLeft.x = 0;  // Left edge
    paddleLeft.y = canvas.height / 2 - paddleLeft.height / 2;

    paddleRight.x = canvas.width - paddleRight.width;  // Right edge
    paddleRight.y = canvas.height / 2 - paddleRight.height / 2;

    // Position the ball in the center of the canvas
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Adjust paddle and ball speeds based on canvas size
    window.paddleSpeed = canvas.height * gameSettings.paddleSpeedFactor;
    window.ballSpeedX = gameSettings.ballSpeedX;
    window.ballSpeedY = gameSettings.ballSpeedY;

    // Apply speed to the ball
    ball.dx = window.ballSpeedX;
    ball.dy = window.ballSpeedY;
}
