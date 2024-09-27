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

import { isGameStarted } from '../Modals/startGameModal.js';

export const powerUpsImages = [
    '..//images/power-ups/sizeUpPaddle.png',
    '../images/power-ups/sizeDownPaddle.png',
    '../images/power-ups/speedPaddle.png',
    '../images/power-ups/slowPaddle.png'
];

export function hidePowerUp(powerUpImageElement) {
    powerUpImageElement.style.display = 'none'; 

    // Annule le timeout en cours si un power-up est actif
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

let powerUpTimeoutId; // stocke l'ID du timeout

export function displayRandomPowerUp(powerUpImageElement, canvas) {
    const randomIndex = Math.floor(Math.random() * powerUpsImages.length);
    const selectedImage = powerUpsImages[randomIndex];

    powerUpImageElement.src = selectedImage;

    powerUpImageElement.onload = function() {
        const naturalWidth = powerUpImageElement.naturalWidth;
        const naturalHeight = powerUpImageElement.naturalHeight;

        // Redimensionner l'image en fonction de la taille du canvas
        const scaleFactor = canvas.width * 0.1;

        const newWidth = naturalWidth * scaleFactor / naturalWidth;
        const newHeight = naturalHeight * scaleFactor / naturalWidth;

        powerUpImageElement.style.width = `${newWidth}px`;
        powerUpImageElement.style.height = `${newHeight}px`;

        // Position aléatoire sur le canvas
        const randomX = Math.random() * (canvas.width - newWidth);
        const randomY = Math.random() * (canvas.height - newHeight);

        powerUpImageElement.style.left = `${canvas.offsetLeft + randomX}px`;
        powerUpImageElement.style.top = `${canvas.offsetTop + randomY}px`;
        powerUpImageElement.style.display = 'block';

        // Cachez après 5 sec
        powerUpTimeoutId = setTimeout(() => {
            powerUpImageElement.style.display = 'none';
        }, 5000);
    };
}

// Exécutez le power-up à intervalle régulier
let nextPowerUpTime = Date.now() + getRandomInterval(8000, 12000); // Délai entre 8 et 12sec

export function generatePowerUp(powerUpImageElement, canvas) {
    const now = Date.now();
    
    if (isGameStarted() && now >= nextPowerUpTime) {
        displayRandomPowerUp(powerUpImageElement, canvas);
        nextPowerUpTime = now + getRandomInterval(8000, 12000); // Délai aléatoire entre 8 et 12 sec
    }
    else if (!isGameStarted()) {
        hidePowerUp(powerUpImageElement);
    }
}
