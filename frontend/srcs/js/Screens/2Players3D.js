// frontend/srcs/js/Screens/2Players3D.js

import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { moveBall } from './1Player3D.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';

document.addEventListener('DOMContentLoaded', function() {
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    // const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    // loadLanguages(storedLang);

    homeIcon.addEventListener('click', () => {
        window.location.href = '/frontend/srcs/html/homeScreen.html';
    });

    initializeGameStartListener(startGameMessage, settingsIcon, homeIcon);
});

resizeRenderer3D();
initializeButton3D();

/* ************************** Mouvement du paddle ******************************* */

export let isGameActive = true;

export function setIsGameActive(value) {
    if (typeof value === 'boolean') {
        isGameActive = value;
    } else {
        console.warn("Invalid value. Please provide a boolean (true or false).");
    }
}

// Mouvement des paddles
const keys = {};

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings3D.paddleDepth3D / 2.30);

// Déplacer les paddles
function movePaddles2Players() {
    // Mouvement du joueur 1 (paddleLeft)
    if (keys['s']) {
        if (paddleLeft.position.z < paddleMovementLimit)
            paddleLeft.position.z += gameSettings3D.paddleSpeed3D;
    }
    if (keys['w']) {
        if (paddleLeft.position.z > -paddleMovementLimit)
            paddleLeft.position.z -= gameSettings3D.paddleSpeed3D;
    }

    // Mouvement du joueur 2 (paddleRight)
    if (keys['ArrowDown']) {
        if (paddleRight.position.z < paddleMovementLimit)
            paddleRight.position.z += gameSettings3D.paddleSpeed3D;
    }
    if (keys['ArrowUp']) {
        if (paddleRight.position.z > -paddleMovementLimit)
            paddleRight.position.z -= gameSettings3D.paddleSpeed3D;
    }
}

/* ********************************************************************************* */

// boucle d'animation
function animate2Players() {
    if (isGameActive && isGameStarted()) {
        movePaddles2Players();
        moveBall();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate2Players);
}

animate2Players();