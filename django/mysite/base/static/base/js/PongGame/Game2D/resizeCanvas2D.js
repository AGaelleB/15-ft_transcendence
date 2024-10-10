// frontend/srcs/js/PongGame/Game2D/resizeCanvas2D.js

import { gameSettings2D } from '../gameSettings.js';

function resizeCanvas(paddleLeft, paddleRight, ball) {
    const canvas = document.getElementById('pongCanvas');
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;

    if (containerWidth / containerHeight < gameSettings2D.aspectRatio) {
        canvas.width = containerWidth * gameSettings2D.canvasWidthFactor;
        canvas.height = canvas.width / gameSettings2D.aspectRatio;
    }
    else {
        canvas.height = containerHeight * gameSettings2D.canvasWidthFactor;
        canvas.width = canvas.height * gameSettings2D.aspectRatio;
    }

    // Ajustement des paddles et de la balle
    paddleLeft.width = canvas.width * gameSettings2D.paddleWidth2D;
    paddleLeft.height = canvas.height * gameSettings2D.paddleHeight2D;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = canvas.width * gameSettings2D.ballSizeFactor2D;

    // Mise à jour des positions initiales
    paddleLeft.y = (canvas.height / 2) - (paddleLeft.height / 2);
    paddleRight.x = canvas.width - paddleRight.width;
    paddleRight.y = (canvas.height / 2) - (paddleRight.height / 2);

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Mise à jour de la vitesse des éléments du jeu
    window.paddleSpeed = canvas.height * gameSettings2D.paddleSpeedFactor;
    window.ballSpeedX2D = canvas.width * gameSettings2D.ballSpeedX2D / 100;
    window.ballSpeedY2D = canvas.height * gameSettings2D.ballSpeedY2D / 100;

    // Application de la vitesse
    ball.dx = window.ballSpeedX2D;
    ball.dy = window.ballSpeedY2D;

    // Ajustement dynamique de la bordure selon gameSettings2D
    const borderSize = Math.max(canvas.width * gameSettings2D.borderFactor, gameSettings2D.minBorderSize);
    canvas.style.border = `${borderSize}px solid ${gameSettings2D.borderColor}`;
}

export { resizeCanvas };
