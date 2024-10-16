// frontend/srcs/js/PongGame/Game3D/power-ups3D.js

import { isGameStarted3D } from '../../Modals/startGameModal3D.js';
import { gameSettings3D } from '../gameSettings.js';
import { getLastTouchedPaddle3D } from './ballCollision3D.js';
import { ground } from './draw3D.js';

/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

let nextPowerUpTime3D = Date.now() + getRandomInterval3D(3000, 5000); // Délai pour le 1er affichage
let powerUpObject3D; // pour l'objet 3D du power-up
let powerUpTimeoutId3D;

// // si docker nginx
// export const powerUpsTextures3D = [
//     new THREE.TextureLoader().load('../images/power-ups/sizeUpPaddle.png'),
//     new THREE.TextureLoader().load('../images/power-ups/sizeDownPaddle.png'),
//     new THREE.TextureLoader().load('../images/power-ups/speedPaddle.png'),
//     new THREE.TextureLoader().load('../images/power-ups/slowPaddle.png')
// ];

// si live server
export const powerUpsTextures3D = [
    new THREE.TextureLoader().load('/frontend/srcs/images/power-ups/sizeUpPaddle.png'),
    new THREE.TextureLoader().load('/frontend/srcs/images/power-ups/sizeDownPaddle.png'),
    new THREE.TextureLoader().load('/frontend/srcs/images/power-ups/speedPaddle.png'),
    new THREE.TextureLoader().load('/frontend/srcs/images/power-ups/slowPaddle.png')
];

export function resetPowerUpTimer3D() {
    nextPowerUpTime3D = Date.now() + getRandomInterval3D(3000, 5000);
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

export function createPowerUp3D(scene) {
    const randomIndex = Math.floor(Math.random() * powerUpsTextures3D.length);
    const selectedTexture = powerUpsTextures3D[randomIndex];

    console.log("***** images loaded 3D *****");

    // Créer un plan avec une texture de power-up
    const geometry = new THREE.PlaneGeometry(7, 7);  // Taille du power-up
    const material = new THREE.MeshBasicMaterial({ map: selectedTexture, transparent: true });
    powerUpObject3D = new THREE.Mesh(geometry, material);

    // Limiter la position aléatoire du power-up aux dimensions du sol
    const groundWidth = ground.geometry.parameters.width;
    const groundHeight = ground.geometry.parameters.height;

    const randomX = (Math.random() - 0.5) * groundWidth;  // Générer X dans les limites du sol
    const randomZ = (Math.random() - 0.5) * groundHeight; // Générer Z dans les limites du sol
    powerUpObject3D.position.set(randomX, 1.5, randomZ);  // Positionner sur le sol (Y = 0)

    scene.add(powerUpObject3D);

    // Le rendre visible pendant un certain temps (7 secondes)
    powerUpTimeoutId3D = setTimeout(() => {
        scene.remove(powerUpObject3D);
    }, 5000);
}

// Générer des power-ups à des intervalles réguliers
export function generatePowerUp3D(scene) {

    const now = Date.now();

    console.log("***** generatePowerUp3D *****");
    console.log("isGameStarted3D: ", isGameStarted3D());
    // console.log("now: ", now);
    // console.log("nextPowerUpTime3D: ", nextPowerUpTime3D);

    if (isGameStarted3D && now >= nextPowerUpTime3D) {
        console.log("***** Je genere les Powers ups *****");
        createPowerUp3D(scene);
        nextPowerUpTime3D = now + getRandomInterval3D(1000, 2000);
    }
}

/* 
    Idee :
    voir sur le met bien le game isGameStarted3D a true en debut de game, on dirait que non
    peut etre utiliser un autre flag
    le power up s affiche une fois mais ensuite une fois disparu il ne revient plus 


*/

/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

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
    const lastTouchedPaddle = getLastTouchedPaddle3D();
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

