// frontend/srcs/js/Screens/2Players3D.js

import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, resetPaddlePosition } from '../PongGame/Game3D/draw3D.js';
import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score } from '../PongGame/Game3D/score3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';

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

let isGameActive = true;

// Mouvement des paddles
const keys = {};

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings3D.paddleDepth3D / 2.30);

// Déplacer les paddles
function movePaddles() {
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

/* ************************** Mouvement de la balle ******************************* */

// Limites de mouvement de la balle
const ballMovementLimitX = groundGeometry.parameters.width / 2 - gameSettings3D.ballRadius3D;
const ballMovementLimitZ = groundGeometry.parameters.height / 2 - gameSettings3D.ballRadius3D;

function checkBallOutOfBounds3D() {
    if (ball.position.x >= ballMovementLimitX) {
        ball.position.set(0, 0, 0);
        setPlayer1Score(player1Score + 1);
        if (gameSettings3D.resetPaddlePosition)
            resetPaddlePosition();
        return true;
    }
    if (ball.position.x <= -ballMovementLimitX) {
        ball.position.set(0, 0, 0);
        setPlayer2Score(player2Score + 1);
        if (gameSettings3D.resetPaddlePosition)
            resetPaddlePosition();
        return true;
    }
    updateScore();
    const gameEnded = checkGameEnd(player1Score, player2Score);
    if (gameEnded) {
        isGameActive = false;
        return;
    }
}

function moveBall() {
    // Mise à jour de la position de la balle
    ball.position.x += gameSettings3D.ballSpeedX3D;
    ball.position.z += gameSettings3D.ballSpeedZ3D;

    // Gestion des rebonds sur les bordures haut/bas (en Z)
    if (ball.position.z >= ballMovementLimitZ || ball.position.z <= -ballMovementLimitZ)
        gameSettings3D.ballSpeedZ3D = -gameSettings3D.ballSpeedZ3D;

    checkBallOutOfBounds3D();

    // Collision avec le paddle player 1
    if (
        ball.position.x - gameSettings3D.ballRadius3D <= paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleLeft.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleLeft.position.z - gameSettings3D.paddleDepth3D / 2
    )
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;

    // Collision avec le paddle player 2
    if (
        ball.position.x + gameSettings3D.ballRadius3D >= paddleRight.position.x - gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleRight.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleRight.position.z - gameSettings3D.paddleDepth3D / 2
    )
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;

}

/* ********************************************************************************* */

// boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    if (isGameActive && isGameStarted()) {
        movePaddles();
        moveBall();
    }
    renderer.render(scene, camera);
}

animate();