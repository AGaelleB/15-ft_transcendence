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

import { isGameStarted } from '../Modals/startGameModal.js';

let nextPowerUpTime = Date.now() + getRandomInterval(17000, 20000); // Délai pour le 1er affichage
let powerUpTimeoutId; // stocke l'ID du timeout

export const powerUpsImages = [
    '..//images/power-ups/sizeUpPaddle.png',
    '../images/power-ups/sizeDownPaddle.png',
    '../images/power-ups/speedPaddle.png',
    '../images/power-ups/slowPaddle.png'
];

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
        }, 5000);
    };
}

export function generatePowerUp(powerUpImageElement, canvas) {
    const now = Date.now();
    
    if (isGameStarted() && now >= nextPowerUpTime) {
        displayRandomPowerUp(powerUpImageElement, canvas);
        nextPowerUpTime = now + getRandomInterval(18000, 25000); // temps entre 2 affichages
    }
    else if (!isGameStarted()) {
        hidePowerUp(powerUpImageElement);
    }
}
