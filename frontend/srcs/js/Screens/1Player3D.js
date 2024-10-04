// frontend/srcs/js/Screens/1Player3D.js

import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, paddleGeometry, ballGeometry, resetPaddlePosition } from '../PongGame/Game3D/draw3D.js';
import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score } from '../PongGame/score.js';
import { gameSettings } from '../PongGame/gameSettings.js';

initializeButton3D();
// initializeGameStartListener(startGameMessage, settingsIcon, homeIcon);
resizeRenderer3D();

/* ************************** Mouvement du paddle ******************************* */

let isGameActive = true;

// Mouvement des paddles
const keys = {};

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
gameSettings.paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleGeometry.parameters.depth / 2.30);

// Déplacer les raquettes avec limites
function movePaddles() {
    if (keys['ArrowUp']) {
        if (paddleLeft.position.z > -gameSettings.paddleMovementLimit)
            paddleLeft.position.z -= 0.3;
    }
    if (keys['ArrowDown']) {
        if (paddleLeft.position.z < gameSettings.paddleMovementLimit)
            paddleLeft.position.z += 0.3;
    }

    // Mouvement paddle droite (pour le moment sans IA et avec des touches 2players)
    if (keys['w']) {
        if (paddleRight.position.z > -gameSettings.paddleMovementLimit)
            paddleRight.position.z -= 0.1;
    }
    if (keys['s']) {
        if (paddleRight.position.z < gameSettings.paddleMovementLimit)
            paddleRight.position.z += 0.1;
    }
}

export function updatePaddleMovementLimits() {
    // Calculer les nouvelles limites de mouvement basées sur la nouvelle taille des paddles
    gameSettings.paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings.paddleDepth / 2.30);
}

/* ************************** Mouvement de la balle ******************************* */

// Vitesse initiale de la balle
let ballSpeedX = 0.2;
let ballSpeedZ = 0.2;

// Limites de mouvement de la balle
gameSettings.ballMovementLimitX = groundGeometry.parameters.width / 2 - ballGeometry.parameters.radius;
gameSettings.ballMovementLimitZ = groundGeometry.parameters.height / 2 - ballGeometry.parameters.radius;

function checkBallOutOfBounds3D() {
    if (ball.position.x >= gameSettings.ballMovementLimitX) {
        ball.position.set(0, 0, 0);
        setPlayer1Score(player1Score + 1);
        if (gameSettings.resetPaddlePosition)
            resetPaddlePosition();
        return true;
    }
    if (ball.position.x <= -gameSettings.ballMovementLimitX) {
        ball.position.set(0, 0, 0);
        setPlayer2Score(player2Score + 1);
        if (gameSettings.resetPaddlePosition)
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
    ball.position.x += ballSpeedX;
    ball.position.z += ballSpeedZ;

    // Gestion des rebonds sur les bordures haut/bas (en Z)
    if (ball.position.z >= gameSettings.ballMovementLimitZ || ball.position.z <= -gameSettings.ballMovementLimitX)
        ballSpeedZ = -ballSpeedZ;

    checkBallOutOfBounds3D();
    // Gestion des rebonds sur les bordures gauche/droite (en X) a mettre comme point marque apres 
    

    if (
        ball.position.x <= paddleLeft.position.x + paddleGeometry.parameters.width / 2 &&
        ball.position.z <= paddleLeft.position.z + paddleGeometry.parameters.depth / 2 &&
        ball.position.z >= paddleLeft.position.z - paddleGeometry.parameters.depth / 2
    )
        ballSpeedX = -ballSpeedX;

    if (
        ball.position.x >= paddleRight.position.x - paddleGeometry.parameters.width / 2 &&
        ball.position.z <= paddleRight.position.z + paddleGeometry.parameters.depth / 2 &&
        ball.position.z >= paddleRight.position.z - paddleGeometry.parameters.depth / 2
    )
        ballSpeedX = -ballSpeedX;
}

export function updateBallMovementLimits() {
    // Calculer les nouvelles limites de mouvement basées sur la nouvelle taille de la balle
    gameSettings.ballMovementLimitX = ground.geometry.parameters.width / 2 - gameSettings.ballRadius;
    gameSettings.ballMovementLimitZ = ground.geometry.parameters.height / 2 - gameSettings.ballRadius;
}

/* ********************************************************************************* */

// boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    if (isGameActive) {
        movePaddles();
        moveBall();
    }
    renderer.render(scene, camera);
}

animate();