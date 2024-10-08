// frontend/srcs/js/Screens/1Player3D.js

import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, resetPaddlePosition } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { updateAI3D } from '../PongGame/Game3D/computerAI3D.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';
import { isGameActive } from '../PongGame/Game3D/ballCollision3D.js';

document.addEventListener('DOMContentLoaded', function() {
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');

    homeIcon.addEventListener('click', () => {
        window.location.href = '/frontend/srcs/html/homeScreen.html';
    });

    initializeGameStartListener(startGameMessage, settingsIcon, homeIcon);
});

resizeRenderer3D();
initializeButton3D();

/* ************************** Mouvement du paddle ******************************* */

const keys = {};

document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings3D.paddleDepth3D / 2.30);

function movePaddles1Player() {
    if (keys['ArrowUp']) {
        if (paddleLeft.position.z > -paddleMovementLimit)
            paddleLeft.position.z -= gameSettings3D.paddleSpeed3D;
    }
    if (keys['ArrowDown']) {
        if (paddleLeft.position.z < paddleMovementLimit)
            paddleLeft.position.z += gameSettings3D.paddleSpeed3D;
    }

    updateAI3D(ball, paddleRight, ground);
}

/* ************************** Mouvement de la balle ******************************* */

// Limites de mouvement de la balle
const ballMovementLimitZ = groundGeometry.parameters.height / 2 - gameSettings3D.ballRadius3D;

export function moveBall() {
    ball.position.x += gameSettings3D.ballSpeedX3D;
    ball.position.z += gameSettings3D.ballSpeedZ3D;

    // Gestion des rebonds sur les bordures haut/bas (en Z)
    if (ball.position.z >= ballMovementLimitZ || ball.position.z <= -ballMovementLimitZ)
        gameSettings3D.ballSpeedZ3D = -gameSettings3D.ballSpeedZ3D;

    checkBallOutOfBounds3D();
    checkPaddleCollision3D(ball, paddleLeft, paddleRight);
}

/* ********************************************************************************* */

function animate1Players() {
    if (isGameActive && isGameStarted()) {
        movePaddles1Player();
        moveBall();
        updateAI3D(ball, paddleRight, ground);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate1Players);
}

animate1Players();