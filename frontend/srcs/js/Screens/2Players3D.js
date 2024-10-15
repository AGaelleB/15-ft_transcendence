// frontend/srcs/js/Screens/2Players3D.js

import { initializeGameStartListener3D, isGameStarted3D, resetGame3D } from '../Modals/startGameModal3D.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { initializeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, draw3D } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';
import { setIsGameOver3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';

let isGameActive3D = true;

export function initialize2Players3D() {
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);

    homeIcon.addEventListener('click', (event) => {
        setIsGameActive(false);
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });

    isGameActive3D = true;
    setIsGameOver3D(false);

    function setIsGameActive(value) {
        if (typeof value === 'boolean')
            isGameActive3D = value;
        else
            console.warn("Invalid value. Please provide a boolean (true or false).");
    }

    initializeButton3D();
    initializeGameStartListener3D(startGameMessage, settingsIcon, homeIcon);

    resetGame3D();
    updateScore3D();
    initializeRenderer3D();

/* ************************** Mouvement du paddle ******************************* */

const keys = {};

document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings3D.paddleDepth3D / 2.30);

function movePaddles2Players() {
    // Player 1
    if (keys['s']) {
        if (paddleLeft.position.z < paddleMovementLimit)
            paddleLeft.position.z += gameSettings3D.paddleSpeed3D;
    }
    if (keys['w']) {
        if (paddleLeft.position.z > -paddleMovementLimit)
            paddleLeft.position.z -= gameSettings3D.paddleSpeed3D;
    }

    // Player 2
    if (keys['ArrowDown']) {
        if (paddleRight.position.z < paddleMovementLimit)
            paddleRight.position.z += gameSettings3D.paddleSpeed3D;
    }
    if (keys['ArrowUp']) {
        if (paddleRight.position.z > -paddleMovementLimit)
            paddleRight.position.z -= gameSettings3D.paddleSpeed3D;
    }
}

/* ************************** Mouvement de la balle ******************************* */
    
    // Limites de mouvement de la balle
    const ballMovementLimitZ = groundGeometry.parameters.height / 2 - gameSettings3D.ballRadius3D;
    
    function moveBall() {
        ball.position.x += gameSettings3D.ballSpeedX3D;
        ball.position.z += gameSettings3D.ballSpeedZ3D;
    
        // Gestion des rebonds sur les bordures haut/bas (en Z)
        if (ball.position.z >= ballMovementLimitZ || ball.position.z <= -ballMovementLimitZ)
            gameSettings3D.ballSpeedZ3D = -gameSettings3D.ballSpeedZ3D;
    
        if (checkBallOutOfBounds3D() === false)
            setIsGameActive(false);
        checkPaddleCollision3D(ball, paddleLeft, paddleRight);
    }

    /* ********************************************************************************* */

    function gameLoop2Players3D() {
        if (isGameActive3D && isGameStarted3D()) {
            movePaddles2Players();
            moveBall();
        }
        else if (!isGameActive3D)
            return;
        renderer.render(scene, camera);
        requestAnimationFrame(gameLoop2Players3D);
    }
    gameLoop2Players3D();
}