// frontend/srcs/js/PongGame/Game2D/power-ups2D.js

import { isGameStarted } from '../../Modals/startGameModal.js';
import { gameSettings2D } from '../gameSettings.js';
import { getLastTouchedPaddle } from './ballCollision2D.js';

/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

let nextPowerUpTime = Date.now() + getRandomInterval(17000, 20000); // Délai pour le 1er affichage
let powerUpTimeoutId;

export const powerUpsImages = [
    '../images/power-ups/sizeUpPaddle.png',
    '../images/power-ups/sizeDownPaddle.png',
    '../images/power-ups/speedPaddle.png',
    '../images/power-ups/slowPaddle.png'
];

export function resetPowerUpTimer() {
    nextPowerUpTime = Date.now() + getRandomInterval(17000, 20000);
}

export function hidePowerUp(powerUpImageElement) {
    powerUpImageElement.style.display = 'none';

    if (powerUpTimeoutId) {
        clearTimeout(powerUpTimeoutId);
        powerUpTimeoutId = null;
    }
}

function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPowerUpImageElement() {

    const powerUpImageElement = document.createElement('img');
    document.body.appendChild(powerUpImageElement);
    powerUpImageElement.style.position = 'absolute';
    powerUpImageElement.style.display = 'none';

    return (powerUpImageElement);
}

export function displayRandomPowerUp(powerUpImageElement, canvas) {
    const randomIndex = Math.floor(Math.random() * powerUpsImages.length);
    const selectedImage = powerUpsImages[randomIndex];

    powerUpImageElement.src = selectedImage;

    powerUpImageElement.onload = function() {
        const naturalWidth = powerUpImageElement.naturalWidth;
        const naturalHeight = powerUpImageElement.naturalHeight;

        const scaleFactor = canvas.width * 0.075;

        const newWidth = naturalWidth * scaleFactor / naturalWidth;
        const newHeight = naturalHeight * scaleFactor / naturalWidth;

        powerUpImageElement.style.width = `${newWidth}px`;
        powerUpImageElement.style.height = `${newHeight}px`;

        // marge de sécurité pour le display
        const marginX = canvas.width * 0.15;
        const marginY = canvas.height * 0.1;

        // marges de sécurité appliquées
        const randomX = marginX + Math.random() * (canvas.width - newWidth - 2 * marginX);
        const randomY = marginY + Math.random() * (canvas.height - newHeight - 2 * marginY);

        powerUpImageElement.style.left = `${canvas.offsetLeft + randomX}px`;
        powerUpImageElement.style.top = `${canvas.offsetTop + randomY}px`;
        powerUpImageElement.style.display = 'block';

        // affiche durant 7 secondes
        powerUpTimeoutId = setTimeout(() => {
            powerUpImageElement.style.display = 'none';
        }, 7000);
    };
}

export function generatePowerUp(powerUpImageElement, canvas) {
    const now = Date.now();

    if (gameSettings2D.setPowerUps && isGameStarted() && now >= nextPowerUpTime) {
        displayRandomPowerUp(powerUpImageElement, canvas);
        nextPowerUpTime = now + getRandomInterval(12000, 25000); // temps entre 2 affichages
    }
    else if (!isGameStarted() || !gameSettings2D.setPowerUps) {
        hidePowerUp(powerUpImageElement);
    }
}


/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

export function checkPowerUpCollision(ball, powerUpImageElement, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    const powerUpRect = powerUpImageElement.getBoundingClientRect();

    // Convertir les coordonnées du power-up en coordonnées du canvas
    const powerUpX = powerUpRect.left - canvasRect.left;
    const powerUpY = powerUpRect.top - canvasRect.top;
    const powerUpWidth = powerUpRect.width;
    const powerUpHeight = powerUpRect.height;

    // Vérifier si la balle chevauche le power-up
    if (ball.x + ball.size > powerUpX &&
        ball.x - ball.size < powerUpX + powerUpWidth &&
        ball.y + ball.size > powerUpY &&
        ball.y - ball.size < powerUpY + powerUpHeight) {
        return (true);
    }
    return (false);
}

/************************** MISE EN PLACE DES EFFETS POWERS-UPS **************************/

export function resetPowerUpEffects(paddleLeft, paddleRight) {
    const canvasHeight = window.canvasHeight || document.getElementById('pongCanvas').height;

    paddleLeft.height = gameSettings2D.paddleHeight2D * canvasHeight; 
    paddleRight.height = gameSettings2D.paddleHeight2D * canvasHeight;

    paddleLeft.speedFactor = gameSettings2D.paddleSpeedFactor * 25;
    paddleRight.speedFactor = gameSettings2D.paddleSpeedFactor * 25;
}

export function applyPowerUpEffect(powerUpSrc, paddleLeft, paddleRight) {
    const lastTouchedPaddle = getLastTouchedPaddle();
    let affectedPaddle;

    if (lastTouchedPaddle === 'left')
        affectedPaddle = paddleLeft;
    else if (lastTouchedPaddle === 'right')
        affectedPaddle = paddleRight;
    else {
        console.warn('Invalid paddle detected');
        return;
    }

    let originalHeight = affectedPaddle.height;
    let originalSpeedFactor = affectedPaddle.speedFactor;

    if (powerUpSrc.includes('sizeUpPaddle.png'))
        affectedPaddle.height *= 1.75;
    else if (powerUpSrc.includes('sizeDownPaddle.png'))
        affectedPaddle.height *= 0.5;
    else if (powerUpSrc.includes('speedPaddle.png'))
        affectedPaddle.speedFactor *= 5;
    else if (powerUpSrc.includes('slowPaddle.png'))
        affectedPaddle.speedFactor *= 0.25;

    setTimeout(() => {
        affectedPaddle.height = originalHeight;
        affectedPaddle.speedFactor = originalSpeedFactor;
    }, gameSettings2D.powerUpEffectDuration2D);
}
