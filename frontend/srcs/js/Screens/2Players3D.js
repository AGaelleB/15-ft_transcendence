// frontend/srcs/js/Screens/2Players3D.js

import { initializeGameStartListener3D, isGameStarted3D, resetGame3D } from '../Modals/startGameModal3D.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { initializeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, drawBallWithSmokeTrail3D } from '../PongGame/Game3D/draw3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';
import { setIsGameOver3D, setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';
import { applyPowerUpEffect3D, checkPowerUpCollision3D, generatePowerUp3D, hidePowerUp3D, powerUpObject3D } from '../PongGame/Game3D/power-ups3D.js';

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

    let animationId;

    window.addEventListener('popstate', function(event) {
        console.log("Retour arrière du navigateur détecté !");
        cleanup1Player3D();
    });

    function cleanup1Player3D() {
        cancelAnimationFrame(animationId);

        document.removeEventListener('keydown', (e) => { keys[e.key] = true; });
        document.removeEventListener('keyup', (e) => { keys[e.key] = false; });
        setPlayer1Score3D(0);
        setPlayer2Score3D(0);
        setIsGameOver3D(false);

        // hidePowerUp3D(scene);
        // resetRallyCount3D(); // A MERGE !!!!!!

        isGameActive3D = false;
        console.log("Jeu réinitialisé et boucle arrêtée.");
    }

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
    paddleLeft.speedFactor = gameSettings3D.paddleSpeed3D;
    paddleRight.speedFactor = gameSettings3D.paddleSpeed3D;
    updateScore3D();
    initializeRenderer3D();

    /* ************************** Mouvement du paddle ******************************* */

    const keys = {};

    document.addEventListener('keydown', (e) => { keys[e.key] = true; });
    document.addEventListener('keyup', (e) => { keys[e.key] = false; });
    
    // limites du mouvement des paddles
    
    function movePaddles2Players() {
        const paddleLeftMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleLeft.paddleDepth3D / 2.30);
        const paddleRightMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleRight.paddleDepth3D / 2.30);
        // Player 1
        if (keys['s']) {
            if (paddleLeft.position.z < paddleLeftMovementLimit)
                paddleLeft.position.z += paddleLeft.speedFactor;
        }
        if (keys['w']) {
            if (paddleLeft.position.z > -paddleLeftMovementLimit)
                paddleLeft.position.z -= paddleLeft.speedFactor;
        }
    
        // Player 2
        if (keys['ArrowDown']) {
            if (paddleRight.position.z < paddleRightMovementLimit)
                paddleRight.position.z += paddleRight.speedFactor;
        }
        if (keys['ArrowUp']) {
            if (paddleRight.position.z > -paddleRightMovementLimit)
                paddleRight.position.z -= paddleRight.speedFactor;
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
    
        if (checkBallOutOfBounds3D(scene) === false)
            setIsGameActive(false);
        checkPaddleCollision3D(ball, paddleLeft, paddleRight);
    }

    /* ********************************************************************************* */

    function gameLoop2Players3D() {
        if (isGameActive3D && isGameStarted3D()) {
            movePaddles2Players();
            moveBall();
            drawBallWithSmokeTrail3D();
            if (gameSettings3D.setPowerUps3D) {
                generatePowerUp3D(scene);
                if (checkPowerUpCollision3D(ball)) {
                    if (powerUpObject3D && powerUpObject3D.material) {
                        applyPowerUpEffect3D(powerUpObject3D.material.map, paddleLeft, paddleRight);
                    }
                    hidePowerUp3D(scene);
                }
            }
        }
        else if (!isGameActive3D)
            return;
    
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(gameLoop2Players3D);
    }
    gameLoop2Players3D();
}
