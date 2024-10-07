// frontend/srcs/js/Screens/1Player3D.js

import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, resetPaddlePosition } from '../PongGame/Game3D/draw3D.js';
import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score } from '../PongGame/Game3D/score3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';

// initializeGameStartListener(startGameMessage, settingsIcon, homeIcon);
resizeRenderer3D();
initializeButton3D();

/* ************************** Mouvement du paddle ******************************* */

let isGameActive = true;

// Mouvement des paddles
const keys = {};

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddlesw
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (gameSettings3D.paddleDepth3D / 2.30);

// Déplacer les raquettes avec limites
function movePaddles() {
    if (keys['ArrowUp']) {
        if (paddleLeft.position.z > -paddleMovementLimit)
            paddleLeft.position.z -= 0.3;
    }
    if (keys['ArrowDown']) {
        if (paddleLeft.position.z < paddleMovementLimit)
            paddleLeft.position.z += 0.3;
    }

    // Mouvement paddle droite (pour le moment sans IA et avec des touches 2players)
    if (keys['w']) {
        if (paddleRight.position.z > -paddleMovementLimit)
            paddleRight.position.z -= 0.3;
    }
    if (keys['s']) {
        if (paddleRight.position.z < paddleMovementLimit)
            paddleRight.position.z += 0.3;
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
    // Gestion des rebonds sur les bordures gauche/droite (en X) a mettre comme point marque apres 

    // Collision avec le paddle gauche
    if (
        ball.position.x - gameSettings3D.ballRadius3D <= paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleLeft.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleLeft.position.z - gameSettings3D.paddleDepth3D / 2
    )
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;

    // Collision avec le paddle droit
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
    if (isGameActive) {
        movePaddles();
        moveBall();
    }
    renderer.render(scene, camera);
}

animate();