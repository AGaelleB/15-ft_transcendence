// frontend/srcs/js/Screens/1Player3D.js

import { handleKeyPress3D, initializeGameStartListener3D, isGameStarted3D, resetGame3D, setGameStarted3D } from '../Modals/startGameModal3D.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { initializeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, drawBallWithSmokeTrail3D } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { updateAI3D } from '../PongGame/Game3D/computerAI3D.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';
import { setIsGameOver3D, setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';
import { applyPowerUpEffect3D, checkPowerUpCollision3D, generatePowerUp3D, hidePowerUp3D, powerUpObject3D, resetPowerUpTimer3D } from '../PongGame/Game3D/power-ups3D.js';
import { resetRallyCount3D } from '../PongGame/Game3D/rallyEffect3D.js';
import { loadPlayerInfos } from '../PongGame/playerInfos.js';
import { setTwoPlayerMode3D } from '../Modals/winMsgModal.js';

export let isGameActive3D = true;
export let animationId3D1P;

export function initialize1Player3D() {
    const startGameMessage3D = document.getElementById('startGameMessage3D');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    const opponentNameElement = document.getElementById('opponentName');
    if (opponentNameElement) {
        opponentNameElement.textContent = "Mr Robot";
    }
    
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);

    loadPlayerInfos();
    setTwoPlayerMode3D(false);

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

    window.addEventListener('popstate', function(event) {
        cleanup1Player3D();
    });

    function cleanup1Player3D() {
        cancelAnimationFrame(animationId3D1P);

        document.removeEventListener('keydown', (e) => { keys[e.key] = true; });
        document.removeEventListener('keyup', (e) => { keys[e.key] = false; });
        document.removeEventListener('keypress', handleKeyPress3D);

        setIsGameOver3D(false);
        setTwoPlayerMode3D(false);

        hidePowerUp3D(scene);
        resetRallyCount3D();

        isGameActive3D = false;
        setGameStarted3D(true);
    }

    initializeButton3D();
    initializeGameStartListener3D(startGameMessage3D, settingsIcon, homeIcon);

    resetGame3D();
    paddleLeft.speedFactor = gameSettings3D.paddleSpeed3D;
    paddleRight.speedFactor = gameSettings3D.paddleSpeed3D;
    paddleLeft.paddleDepth3D = gameSettings3D.paddleDepth3D;
    paddleRight.paddleDepth3D = gameSettings3D.paddleDepth3D;
    updateScore3D();
    initializeRenderer3D();

    /* ************************** Mouvement du paddle ******************************* */

    const keys = {};

    document.addEventListener('keydown', (e) => { keys[e.key] = true; });
    document.addEventListener('keyup', (e) => { keys[e.key] = false; });

    // limites du mouvement des paddles
    function movePaddles1Player() {
        const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleLeft.paddleDepth3D / 2.30);
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            if (paddleLeft.position.z > -paddleMovementLimit)
                paddleLeft.position.z -= paddleLeft.speedFactor;
        }
        if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            if (paddleLeft.position.z < paddleMovementLimit)
                paddleLeft.position.z += paddleLeft.speedFactor;
        }
    
        updateAI3D(ball, paddleRight, ground);
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

    function gameLoop1Player3D() {
        if (isGameActive3D && isGameStarted3D()) {
            movePaddles1Player();
            moveBall();
            updateAI3D(ball, paddleRight, ground);
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
        else {
            hidePowerUp3D(scene);
            resetPowerUpTimer3D();
        }
        renderer.render(scene, camera);
        animationId3D1P = requestAnimationFrame(gameLoop1Player3D);
    }
    gameLoop1Player3D();
}
