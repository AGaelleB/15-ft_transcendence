// frontend/srcs/js/PongGame/Game3D/power-ups3D.js

import { isGameStarted } from '../../Modals/startGameModal.js';
import { gameSettings3D } from '../gameSettings.js';
import { getLastTouchedPaddle } from './ballCollision3D.js';
import { ground } from './draw3D.js';

/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

let nextPowerUpTime3D = Date.now() + getRandomInterval3D(5000, 10000); // Délai pour le 1er affichage
let powerUpObject3D; // pour l'objet 3D du power-up
let powerUpTimeoutId3D;

export const powerUpsTextures3D = [
    new THREE.TextureLoader().load('../images/power-ups/sizeUpPaddle.png'),
    new THREE.TextureLoader().load('../images/power-ups/sizeDownPaddle.png'),
    new THREE.TextureLoader().load('../images/power-ups/speedPaddle.png'),
    new THREE.TextureLoader().load('../images/power-ups/slowPaddle.png')
];

export function resetPowerUpTimer3D() {
    nextPowerUpTime3D = Date.now() + getRandomInterval3D(17000, 20000);
}

export function hidePowerUp3D(powerUpImageElement) {
    powerUpImageElement.style.display = 'none';

    if (powerUpTimeoutId3D) {
        clearTimeout3D(powerUpTimeoutId3D);
        powerUpTimeoutId3D = null;
    }
}

function getRandomInterval3D(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPowerUp3DImageElement3D() {

    const powerUpImageElement = document.createElement('img');
    document.body.appendChild(powerUpImageElement);
    powerUpImageElement.style.position = 'absolute';
    powerUpImageElement.style.display = 'none';

    return (powerUpImageElement);
}

// export function displayRandomPowerUp3D(powerUpImageElement, canvas) {
//     const randomIndex = Math.floor(Math.random() * powerUpsImages.length);
//     const selectedImage = powerUpsImages[randomIndex];

//     powerUpImageElement.src = selectedImage;

//     powerUpImageElement.onload = function() {
//         const naturalWidth = powerUpImageElement.naturalWidth;
//         const naturalHeight = powerUpImageElement.naturalHeight;

//         const scaleFactor = canvas.width * 0.075;

//         const newWidth = naturalWidth * scaleFactor / naturalWidth;
//         const newHeight = naturalHeight * scaleFactor / naturalWidth;

//         powerUpImageElement.style.width = `${newWidth}px`;
//         powerUpImageElement.style.height = `${newHeight}px`;

//         // marge de sécurité pour le display
//         const marginX = canvas.width * 0.15;
//         const marginY = canvas.height * 0.1;

//         // marges de sécurité appliquées
//         const randomX = marginX + Math.random() * (canvas.width - newWidth - 2 * marginX);
//         const randomY = marginY + Math.random() * (canvas.height - newHeight - 2 * marginY);

//         powerUpImageElement.style.left = `${canvas.offsetLeft + randomX}px`;
//         powerUpImageElement.style.top = `${canvas.offsetTop + randomY}px`;
//         powerUpImageElement.style.display = 'block';

//         // affiche durant 7 secondes
//         powerUpTimeoutId3D = setTimeout(() => {
//             powerUpImageElement.style.display = 'none';
//         }, 7000);
//     };
// }


export function createPowerUp3D(scene) {
    const randomIndex = Math.floor(Math.random() * powerUpsTextures3D.length);
    const selectedTexture = powerUpsTextures3D[randomIndex];

    // Créer un plan avec une texture de power-up
    const geometry = new THREE.PlaneGeometry(5, 5);  // Taille du power-up
    const material = new THREE.MeshBasicMaterial({ map: selectedTexture, transparent: true });
    powerUpObject3D = new THREE.Mesh(geometry, material);

    // Limiter la position aléatoire du power-up aux dimensions du sol
    const groundWidth = ground.geometry.parameters.width;
    const groundHeight = ground.geometry.parameters.height;

    const randomX = (Math.random() - 0.5) * groundWidth;  // Générer X dans les limites du sol
    const randomZ = (Math.random() - 0.5) * groundHeight; // Générer Z dans les limites du sol
    powerUpObject3D.position.set(randomX, 0, randomZ);  // Positionner sur le sol (Y = 0)

    scene.add(powerUpObject3D);

    // Le rendre visible pendant un certain temps (7 secondes)
    powerUpTimeoutId3D = setTimeout(() => {
        scene.remove(powerUpObject3D);
    }, 7000);
}

// Générer des power-ups à des intervalles réguliers
export function generatePowerUp3D(scene) {
    const now = Date.now();
    if (isGameStarted() && now >= nextPowerUpTime3D) {
        createPowerUp3D(scene);
        nextPowerUpTime3D = now + getRandomInterval3D(12000, 25000);
    }
}



/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

// export function checkPowerUpCollision(ball, powerUpImageElement, canvas) {
//     const canvasRect = canvas.getBoundingClientRect();
//     const powerUpRect = powerUpImageElement.getBoundingClientRect();

//     // Convertir les coordonnées du power-up en coordonnées du canvas
//     const powerUpX = powerUpRect.left - canvasRect.left;
//     const powerUpY = powerUpRect.top - canvasRect.top;
//     const powerUpWidth = powerUpRect.width;
//     const powerUpHeight = powerUpRect.height;

//     // Vérifier si la balle chevauche le power-up
//     if (ball.x + ball.size > powerUpX &&
//         ball.x - ball.size < powerUpX + powerUpWidth &&
//         ball.y + ball.size > powerUpY &&
//         ball.y - ball.size < powerUpY + powerUpHeight) {
//         return (true);
//     }
//     return (false);
// }


export function checkPowerUpCollision3D(ball) {
    if (!powerUpObject3D) 
        return false;

    // Vérifier si la balle chevauche le power-up
    const distance = ball.position.distanceTo(powerUpObject3D.position);
    return distance < (gameSettings3D.ballRadius3D + 2.5);  // 2.5 est la moitié de la taille du power-up
}


/************************** MISE EN PLACE DES EFFETS POWERS-UPS **************************/

export function resetPowerUpEffects3D(paddleLeft, paddleRight) {
    const canvasHeight = window.canvasHeight || document.getElementById('pongCanvas').height;

    paddleLeft.height = gameSettings3D.paddleHeight3D * canvasHeight; 
    paddleRight.height = gameSettings3D.paddleHeight3D * canvasHeight;

    paddleLeft.speedFactor = gameSettings3D.paddleSpeed3D * 25;
    paddleRight.speedFactor = gameSettings3D.paddleSpeed3D * 25;
}

export function applyPowerUpEffect3D(powerUpTexture, paddleLeft, paddleRight) {
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

    if (powerUpTexture === powerUpsTextures3D[0])  // sizeUpPaddle.png
        affectedPaddle.scale.y *= 1.75;
    else if (powerUpTexture === powerUpsTextures3D[1])  // sizeDownPaddle.png
        affectedPaddle.scale.y *= 0.5;
    else if (powerUpTexture === powerUpsTextures3D[2])  // speedPaddle.png
        affectedPaddle.speedFactor *= 5;
    else if (powerUpTexture === powerUpsTextures3D[3])  // slowPaddle.png
        affectedPaddle.speedFactor *= 0.25;

    // Réinitialiser après la durée de l'effet
    setTimeout(() => {
        affectedPaddle.scale.y = originalHeight;
        affectedPaddle.speedFactor = originalSpeedFactor;
    }, gameSettings3D.powerUpEffectDuration3D);
}

