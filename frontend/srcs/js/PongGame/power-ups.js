// frontend/srcs/js/PongGame/power-ups.js

/* 
    Durée des effets : les powers ups vont durer entre 5 à 10 secondes
    Apparition aléatoire : Les power-ups peuvent apparaître aléatoirement sur le terrain à intervalles réguliers
    Indicateur visuel : Ajoute un indicateur visuel lorsque les power-ups sont actifs (couleur, taille, effet lumineux, etc.

    Bonus :
        - va augmenter temporairement la taille de notre paddle (champi)
        - va augmenter temporairement la vitessse de notre paddle (eclair)
    Malus : 
        - va reduire temporairement la taille de notre paddle (chanpi dead)
        - va reduire temporairement la vitessse de notre paddle (tortue)

*/

// frontend/srcs/js/PongGame/power-ups.js


/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

import { isGameStarted } from '../Modals/startGameModal.js';
import { gameSettings } from './gameSettings.js';
import { getLastTouchedPaddle } from './ballCollision.js'; // Importer la fonction qui renvoie le dernier paddle qui a touché la balle

// let nextPowerUpTime = Date.now() + getRandomInterval(17000, 20000); // Délai pour le 1er affichage
let nextPowerUpTime = Date.now() + getRandomInterval(1000, 2000); // Délai pour le 1er affichage
let powerUpTimeoutId; // stocke l'ID du timeout

export const powerUpsImages = [
    // '..//images/power-ups/sizeUpPaddle.png',
    // '../images/power-ups/sizeDownPaddle.png',
    '../images/power-ups/speedPaddle.png',
    '../images/power-ups/slowPaddle.png'
];

export function resetPowerUpTimer() {
    // nextPowerUpTime = Date.now() + getRandomInterval(17000, 20000);
    nextPowerUpTime = Date.now() + getRandomInterval(1000, 2000);
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

        // affiche durant 5 secondes
        powerUpTimeoutId = setTimeout(() => {
            powerUpImageElement.style.display = 'none';
        }, 15000);
    };
}

export function generatePowerUp(powerUpImageElement, canvas) {
    const now = Date.now();

    if (isGameStarted() && now >= nextPowerUpTime) {
        displayRandomPowerUp(powerUpImageElement, canvas);
        // nextPowerUpTime = now + getRandomInterval(18000, 25000); // temps entre 2 affichages
        nextPowerUpTime = now + getRandomInterval(15000, 25000); // temps entre 2 affichages
    }
    else if (!isGameStarted()) {
        hidePowerUp(powerUpImageElement);
    }
}


/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

// Fonction pour vérifier la collision entre la balle et un power-up
export function checkPowerUpCollision(ball, powerUpImageElement, canvas) {
    // Obtenir la position du power-up relative au canvas
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
        console.log("Collision detected between ball and power-up!");
        return true;
    }
    return false;
}


/************************** MISE EN PLACE DES EFFETS POWERS-UPS **************************/

export function applyPowerUpEffect(powerUpSrc, paddleLeft, paddleRight) {
    const lastTouchedPaddle = getLastTouchedPaddle();

    let affectedPaddle;
    let originalPaddleSpeedFactor = gameSettings.paddleSpeedFactor;

    if (lastTouchedPaddle === 'left') {
        affectedPaddle = paddleLeft;
    }
    else if (lastTouchedPaddle === 'right') {
        affectedPaddle = paddleRight;
    }
    else {
        console.warn('Invalid paddle detected');
        return;
    }

    let originalHeight = affectedPaddle.height;

    // Appliquer l'effet en fonction du type de power-up
    if (powerUpSrc.includes('sizeUpPaddle.png')) {
        affectedPaddle.height *= 1.75; // Agrandir le paddle
    } 
    else if (powerUpSrc.includes('sizeDownPaddle.png')) {
        affectedPaddle.height *= 0.5; // Réduire la taille du paddle
    } 
    else if (powerUpSrc.includes('speedPaddle.png')) {
        gameSettings.paddleSpeedFactor *= 5; // Augmenter la vitesse du paddle
        console.log("power-up speedPaddle++ ", gameSettings.paddleSpeedFactor);

    } 
    else if (powerUpSrc.includes('slowPaddle.png')) {
        gameSettings.paddleSpeedFactor *= 0.25; // Réduire la vitesse du paddle
        console.log("power-up speedPaddle-- ", gameSettings.paddleSpeedFactor);
    }

    // Réinitialiser les effets après une durée spécifique
    setTimeout(() => {
        affectedPaddle.height = originalHeight;
        gameSettings.paddleSpeedFactor = originalPaddleSpeedFactor; // Réinit la vitesse
        
        console.log(" *** Effet du power-up terminé *** ");
        console.log("originalPaddleSpeedFactor = ", originalPaddleSpeedFactor);
        console.log("gameSettings.paddleSpeedFactor = ", gameSettings.paddleSpeedFactor);
        console.log(" *** *** *** *** *** *** ");

    }, gameSettings.powerUpEffectDuration);
}