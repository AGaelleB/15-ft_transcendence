// frontend/srcs/js/resizeCanvas.js

import { gameSettings } from './gameSettings.js';

export function resizeCanvas(paddleLeft, paddleRight, ball) {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;
    const aspectRatio = gameSettings.aspectRatio;

    // Calculate the new canvas size based on the aspect ratio
    let canvasWidth, canvasHeight;
    if (containerWidth / containerHeight < aspectRatio) {
        canvasWidth = containerWidth * gameSettings.canvasWidthFactor;
        canvasHeight = canvasWidth / aspectRatio;
    }
    else {
        canvasHeight = containerHeight * gameSettings.canvasWidthFactor;
        canvasWidth = canvasHeight * aspectRatio;
    }

    // Utilisez la nouvelle taille calculée pour mettre à jour les dimensions des éléments du jeu
    const effectiveCanvasWidth = Math.min(canvasWidth, gameSettings.canvasWidth);
    const effectiveCanvasHeight = Math.min(canvasHeight, gameSettings.canvasHeight);

    // Adjust paddle and ball sizes using factors from gameSettings
    paddleLeft.width = effectiveCanvasWidth * gameSettings.paddleWidthFactor;
    paddleLeft.height = effectiveCanvasHeight * gameSettings.paddleHeightFactor;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = effectiveCanvasWidth * gameSettings.ballSizeFactor;

    // Update paddle positions
    paddleLeft.y = effectiveCanvasHeight / 2 - paddleLeft.height / 2;
    paddleRight.x = effectiveCanvasWidth - paddleRight.width;
    paddleRight.y = effectiveCanvasHeight / 2 - paddleRight.height / 2;

    // Update ball position
    ball.x = effectiveCanvasWidth / 2;
    ball.y = effectiveCanvasHeight / 2;

    // Update canvas border size
    const borderSize = `${Math.max(effectiveCanvasWidth * gameSettings.borderFactor, gameSettings.minBorderSize)}px solid #a16935`;
    document.querySelector('.game-container').style.border = borderSize;

    // Adjust paddle and ball speed based on canvas size
    window.paddleSpeed = effectiveCanvasHeight * gameSettings.paddleSpeedFactor;
    window.ballSpeedX = gameSettings.ballSpeedX;
    window.ballSpeedY = gameSettings.ballSpeedY;

    // Apply the new speed to the ball
    ball.dx = window.ballSpeedX;
    ball.dy = window.ballSpeedY;
}
