// frontend/srcs/js/Screens/1Player3D.js

import { initializeGameStartListener3D, isGameStarted } from '../Modals/startGameModal3D.js';
import { initializeButton3D } from '../Modals/settingsModal.js';
import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, groundGeometry, resetPaddlePosition } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { updateAI3D } from '../PongGame/Game3D/computerAI3D.js';
import { checkPaddleCollision3D, checkBallOutOfBounds3D } from '../PongGame/Game3D/ballCollision3D.js';
import { updateScore3D } from '../PongGame/Game3D/score3D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';

let isGameActive3D = true;

export function initialize1Player3D() {
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);

    homeIcon.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
    initializeGameStartListener3D(startGameMessage, settingsIcon, homeIcon);
    
    isGameActive3D = true;
    
    resizeRenderer3D();
    initializeButton3D();
    updateScore3D();
    
    function setIsGameActive(value) {
        if (typeof value === 'boolean')
            isGameActive3D = value;
        else
        console.warn("Invalid value. Please provide a boolean (true or false).");
    }
    
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
    
    function animate1Players() {
        console.log("isGameActive3D: ", isGameActive3D);
        if (isGameActive3D && isGameStarted()) {
            movePaddles1Player();
            moveBall();
            updateAI3D(ball, paddleRight, ground);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate1Players);
    }
    animate1Players();
}