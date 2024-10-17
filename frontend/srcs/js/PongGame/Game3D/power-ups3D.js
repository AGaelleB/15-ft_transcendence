// frontend/srcs/js/PongGame/Game3D/power-ups3D.js

import { isGameStarted3D } from '../../Modals/startGameModal3D.js';
import { gameSettings3D } from '../gameSettings.js';
import { getLastTouchedPaddle3D } from './ballCollision3D.js';
import { ground } from './draw3D.js';

/*********************** MISE EN PLACE ET AFFICHAGE DES POWERS-UPS ***********************/

let nextPowerUpTime3D = Date.now() + getRandomInterval3D(5000, 7000); // Délai pour le 1er affichage
export let powerUpObject3D; // pour l'objet 3D du power-up
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

export function hidePowerUp3D(scene) {
    if (powerUpObject3D) {
        scene.remove(powerUpObject3D);
        powerUpObject3D = null;
    }

    // Annuler le timeout si le power-up est masqué avant la fin du délai
    if (powerUpTimeoutId3D) {
        clearTimeout(powerUpTimeoutId3D);
        powerUpTimeoutId3D = null;
    }
}

export function displayPowerUp3D(scene) {
    const randomIndex = Math.floor(Math.random() * powerUpsTextures3D.length);
    const selectedTexture = powerUpsTextures3D[randomIndex];

    // Créer un plan avec une texture de power-up
    const geometry = new THREE.PlaneGeometry(7, 7);  // Taille du power-up
    const material = new THREE.MeshBasicMaterial({ map: selectedTexture, transparent: true });
    powerUpObject3D = new THREE.Mesh(geometry, material);

    // Limiter aux dimensions du ground
    const groundWidth = ground.geometry.parameters.width;
    const groundHeight = ground.geometry.parameters.height;

    // Marge de sécurité
    const margin = 0.2;
    const marginWidth = groundWidth * (1 - margin);
    const marginHeight = groundHeight * (1 - margin);

    // Genere les power ups dans la zone definie
    const randomX = (Math.random() - 0.5) * marginWidth;
    const randomZ = (Math.random() - 0.5) * marginHeight;
    powerUpObject3D.position.set(randomX, 1, randomZ);  // Position sur le sol

    scene.add(powerUpObject3D);

    // Temps de visibilité
    powerUpTimeoutId3D = setTimeout(() => {
        scene.remove(powerUpObject3D);
    }, 14000);
}

function getRandomInterval3D(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/******************** DETECTION DES COLISSIONS ENTRE IMG ET POWERS-UPS ********************/

export function checkPowerUpCollision3D(ball) {
    if (!powerUpObject3D) {
        return false;
    }

    // Taille approximative du power-up
    const powerUpSize = 3.5;

    // Vérifier les distances sur chaque axe séparément (X, Y, Z)
    const distanceX = Math.abs(ball.position.x - powerUpObject3D.position.x);
    const distanceY = Math.abs(ball.position.y - powerUpObject3D.position.y);
    const distanceZ = Math.abs(ball.position.z - powerUpObject3D.position.z);

    const collisionX = distanceX < (ball.geometry.parameters.radius + powerUpSize);
    const collisionY = distanceY < (ball.geometry.parameters.radius + powerUpSize); 
    const collisionZ = distanceZ < (ball.geometry.parameters.radius + powerUpSize);

    return collisionX && collisionY && collisionZ;
}

/************************** MISE EN PLACE DES EFFETS POWERS-UPS **************************/

export function resetPowerUpEffects3D(paddleLeft, paddleRight) {
    const canvasHeight = window.canvasHeight || document.getElementById('pongCanvas').height;

    paddleLeft.height = gameSettings3D.paddleHeight3D * canvasHeight; 
    paddleRight.height = gameSettings3D.paddleHeight3D * canvasHeight;

    paddleLeft.speedFactor = gameSettings3D.paddleSpeed3D;
    paddleRight.speedFactor = gameSettings3D.paddleSpeed3D;
}

function setAffectedPaddle(affectedPaddle) {
    // Redessiner la raquette après changement de profondeur
    affectedPaddle.geometry.dispose(); // Supprimer l'ancienne géométrie
    const newPaddleGeometry = new THREE.BoxGeometry(
        gameSettings3D.paddleWidth3D, 
        gameSettings3D.paddleHeight3D, 
        affectedPaddle.paddleDepth3D * affectedPaddle.scale.z  // Changer la profondeur (axe Z)
    );
    affectedPaddle.paddleDepth3D = gameSettings3D.paddleDepth3D * affectedPaddle.scale.z;
    affectedPaddle.geometry = newPaddleGeometry;  // Appliquer la nouvelle géométrie
}

function updatePaddleMovementLimit() {
    return (ground.geometry.parameters.height / 2.30) - (paddleLeft.paddleDepth3D / 2.30);
}

export function applyPowerUpEffect3D(powerUpTexture, paddleLeft, paddleRight) {
    const lastTouchedPaddle = getLastTouchedPaddle3D();
    let affectedPaddle;

    if (lastTouchedPaddle === 'left') {
        affectedPaddle = paddleLeft;
    } else if (lastTouchedPaddle === 'right') {
        affectedPaddle = paddleRight;
    } else {
        console.warn('Invalid paddle detected');
        return;
    }

    // Sauvegarder la profondeur originale
    const originalDepth = affectedPaddle.scale.z;
    const originalSpeed = affectedPaddle.speedFactor;

    // Appliquer l'effet du power-up (modification de la profondeur, axe Z)
    if (powerUpTexture === powerUpsTextures3D[0]) { // sizeUpPaddle.png
        affectedPaddle.scale.z *= 1.15;  // Augmenter la profondeur
        setAffectedPaddle(affectedPaddle);
    }
    else if (powerUpTexture === powerUpsTextures3D[1]) { // sizeDownPaddle.png
        affectedPaddle.scale.z *= 0.5;  // Réduire la profondeur
        setAffectedPaddle(affectedPaddle);
    }
    else if (powerUpTexture === powerUpsTextures3D[2]) { // speedPaddle.png
        affectedPaddle.speedFactor *= 1.75;  // Augmenter la vitesse
    }
    else if (powerUpTexture === powerUpsTextures3D[3]) { // slowPaddle.png
        affectedPaddle.speedFactor *= 0.25;  // Réduire la vitesse
    }

    // Réinitialiser après la durée de l'effet
    setTimeout(() => {
        affectedPaddle.scale.z = gameSettings3D.paddleDepth3D;  // Réinitialiser la profondeur
        affectedPaddle.speedFactor = gameSettings3D.paddleSpeed3D;  // Réinitialiser la vitesse
        affectedPaddle.geometry.dispose();  // Supprimer la géométrie modifiée
        const resetPaddleGeometry = new THREE.BoxGeometry(
            gameSettings3D.paddleWidth3D, 
            gameSettings3D.paddleHeight3D, 
            gameSettings3D.paddleDepth3D // Réinitialiser la profondeur
        );
        affectedPaddle.geometry = resetPaddleGeometry;  // Appliquer la géométrie originale
        paddleMovementLimit = updatePaddleMovementLimit();
    }, gameSettings3D.powerUpEffectDuration3D);
}

/************************** FONCTION PRINCIPALE POWERS-UPS **************************/

export function generatePowerUp3D(scene, ball) {

    const now = Date.now();

    if (isGameStarted3D && now >= nextPowerUpTime3D) {
        displayPowerUp3D(scene);
        nextPowerUpTime3D = now + getRandomInterval3D(5000, 7000);
    }
}


