// frontend/srcs/js/resizeCanvas.js

import { gameSettings } from './gameSettings.js';

function resizeCanvas(paddleLeft, paddleRight, ball) {
    const canvas = document.getElementById('pongCanvas');
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;

    if (containerWidth / containerHeight < gameSettings.aspectRatio) {
        canvas.width = containerWidth * gameSettings.canvasWidthFactor;
        canvas.height = canvas.width / gameSettings.aspectRatio;
    }
    else {
        canvas.height = containerHeight * gameSettings.canvasWidthFactor;
        canvas.width = canvas.height * gameSettings.aspectRatio;
    }

    // Ajustement des paddles et de la balle
    paddleLeft.width = canvas.width * gameSettings.paddleWidthFactor;
    paddleLeft.height = canvas.height * gameSettings.paddleHeightFactor;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = canvas.width * gameSettings.ballSizeFactor;

    // Mise à jour des positions initiales
    paddleLeft.y = (canvas.height / 2) - (paddleLeft.height / 2);
    paddleRight.x = canvas.width - paddleRight.width;
    paddleRight.y = (canvas.height / 2) - (paddleRight.height / 2);

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Mise à jour de la vitesse des éléments du jeu
    window.paddleSpeed = canvas.height * gameSettings.paddleSpeedFactor;
    window.ballSpeedX = canvas.width * gameSettings.ballSpeedX / 100;
    window.ballSpeedY = canvas.height * gameSettings.ballSpeedY / 100;

    // Application de la vitesse
    ball.dx = window.ballSpeedX;
    ball.dy = window.ballSpeedY;

    // Ajustement dynamique de la bordure selon gameSettings
    const borderSize = Math.max(canvas.width * gameSettings.borderFactor, gameSettings.minBorderSize);
    canvas.style.border = `${borderSize}px solid ${gameSettings.borderColor}`;
}

export { resizeCanvas };
