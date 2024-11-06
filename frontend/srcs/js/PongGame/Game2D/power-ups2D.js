// frontend/srcs/js/PongGame/Game2D/power-ups2D.js

import { gameStarted2D, isGameStarted2D } from '../../Modals/startGameModal2D.js';
import { gameSettings2D } from '../gameSettings.js';
import { getLastTouchedPaddle2D } from './ballCollision2D.js';

/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

let nextPowerUpTime = Date.now() + getRandomInterval2D(gameSettings2D.powerUpStart2D, gameSettings2D.powerUpEnd2D); // Délai pour le 1er affichage
let powerUpTimeoutId;

const powerUpsImages = [
    '../images/power-ups/sizeUpPaddle.png',
    '../images/power-ups/sizeDownPaddle.png',
    '../images/power-ups/speedPaddle.png',
    '../images/power-ups/slowPaddle.png'
];

export function resetPowerUpTimer2D() {
    nextPowerUpTime = Date.now() + getRandomInterval2D(gameSettings2D.powerUpStart2D, gameSettings2D.powerUpEnd2D);
}

export function hidePowerUp(powerUpImageElement) {
    powerUpImageElement.style.display = 'none';

    if (powerUpTimeoutId) {
        clearTimeout(powerUpTimeoutId);
        powerUpTimeoutId = null;
    }
}

function getRandomInterval2D(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPowerUpImageElement2D() {

    const powerUpImageElement = document.createElement('img');
    document.body.appendChild(powerUpImageElement);
    powerUpImageElement.style.position = 'absolute';
    powerUpImageElement.style.display = 'none';

    return (powerUpImageElement);
}

function displayRandomPowerUp2D(powerUpImageElement, canvas) {
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
        }, gameSettings2D.powerUpVisibilityDuration2D);
    };
}

export function generatePowerUp2D(powerUpImageElement, canvas) {
    const now = Date.now();

    if (gameSettings2D.setPowerUps && isGameStarted2D() && now >= nextPowerUpTime) {
        displayRandomPowerUp2D(powerUpImageElement, canvas);
        nextPowerUpTime = now + getRandomInterval2D(12000, 25000); // temps entre 2 affichages
    }
    else if (!isGameStarted2D() || !gameSettings2D.setPowerUps) {
        hidePowerUp(powerUpImageElement);
    }
}


/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

export function checkPowerUpCollision2D(ball, powerUpImageElement, canvas) {
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

export function resetPowerUpEffects2D(paddleLeft, paddleRight) {
    const canvasHeight = window.canvasHeight || document.getElementById('pongCanvas').height;

    paddleLeft.height = gameSettings2D.paddleHeight2D * canvasHeight; 
    paddleRight.height = gameSettings2D.paddleHeight2D * canvasHeight;

    paddleLeft.speedFactor = gameSettings2D.paddleSpeedFactor * 25;
    paddleRight.speedFactor = gameSettings2D.paddleSpeedFactor * 25;
}

export function applyPowerUpEffect2D(powerUpSrc, paddleLeft, paddleRight) {
    const lastTouchedPaddle = getLastTouchedPaddle2D();
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
        affectedPaddle.speedFactor *= 0.15;

    setTimeout(() => {
        affectedPaddle.height = originalHeight;
        affectedPaddle.speedFactor = originalSpeedFactor;
    }, gameSettings2D.powerUpEffectDuration2D);
}
