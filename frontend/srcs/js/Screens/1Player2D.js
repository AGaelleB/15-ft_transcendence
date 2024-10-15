// frontend/srcs/js/Screens/1Player2D.js

import { initializeGameStartListener2D, isGameStarted } from '../Modals/startGameModal2D.js';
import { initializeButton2D } from '../Modals/settingsModal.js';
import { resizeCanvas } from '../PongGame/Game2D/resizeCanvas2D.js';
import { updateAI } from '../PongGame/Game2D/computerAI2D.js';
import { gameSettings2D } from '../PongGame/gameSettings.js';
import { startCountdown } from '../PongGame/chrono.js';
import { drawDottedLine, drawBall, drawPaddle } from '../PongGame/Game2D/draw2D.js';
import { setLastTouchedPaddle, handleWallCollision, checkBallOutOfBounds, checkPaddleCollision } from '../PongGame/Game2D/ballCollision2D.js';
import { setPlayer1Score2D, setPlayer2Score2D, updateScore2D, checkGameEnd2D, player1Score2D, player2Score2D, setIsGameOver2D } from '../PongGame/Game2D/score2D.js';
import { createPowerUpImageElement, generatePowerUp, hidePowerUp, resetPowerUpTimer, applyPowerUpEffect, checkPowerUpCollision, resetPowerUpEffects} from '../PongGame/Game2D/power-ups2D.js';
import { incrementRallyCount, resetRallyCount } from '../PongGame/Game2D/rallyEffect2D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';

export function initialize1Player2D() {
    
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    const powerUpImageElement = createPowerUpImageElement();
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);
    
    homeIcon.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
    
    let isGameActive2d = true;
    setIsGameOver2D(false);

    function setIsGameActive2d(value) {
        if (typeof value === 'boolean')
            isGameActive2d = value;
        else
            console.warn("Invalid value. Please provide a boolean (true or false).");
    }
    
    initializeButton2D();
    initializeGameStartListener2D(startGameMessage, settingsIcon, homeIcon);
    
    let paddleSpeed = gameSettings2D.canvasHeight * gameSettings2D.paddleSpeedFactor;

    const paddleLeft = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0,
        speedFactor: gameSettings2D.paddleSpeedFactor * 25
    };
    
    const paddleRight = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0,
        speedFactor: gameSettings2D.paddleSpeedFactor * 25
    };
    
    const ball = {
        x: 0,
        y: 0,
        size: 0,
        dx: 0,
        dy: 0
    };

    let ballOutOfBounds = false;

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    
        const savedDx = ball.dx;
        const savedDy = ball.dy;
    
        setLastTouchedPaddle(null);

        ball.dx = 0;
        ball.dy = 0;

        resetPowerUpEffects(paddleLeft, paddleRight);
        hidePowerUp(powerUpImageElement);
        resetPowerUpTimer();
    
        startCountdown(() => {
            const direction = Math.floor(Math.random() * 2);
            if (direction === 0)
                ball.dx = -savedDx;
            else
                ball.dx = savedDx;
            const verticalDirection = Math.floor(Math.random() * 2);
            if (verticalDirection === 0)
                ball.dy = savedDy;
            else
                ball.dy = -savedDy;
            ballOutOfBounds = false;
        });
    }

    function update() {
        updateScore2D(); 
        const gameEnded = checkGameEnd2D(player1Score2D, player2Score2D);
        if (gameEnded) {
            setIsGameActive2d(false);
            hidePowerUp(powerUpImageElement);
            return;
        }
    
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        handleWallCollision(ball, canvas);
        checkPaddleCollision(ball, paddleLeft, paddleRight, () => {
            ballOutOfBounds = false;
            incrementRallyCount();
        });
        
        // Check collision with power-up
        if (gameSettings2D.setPowerUps) {
            if (powerUpImageElement.style.display === 'block' && checkPowerUpCollision(ball, powerUpImageElement, canvas)) {
                applyPowerUpEffect(powerUpImageElement.src, paddleLeft, paddleRight);
                hidePowerUp(powerUpImageElement);
            }
        }

        if (checkBallOutOfBounds(ball, canvas, 
            () => setPlayer1Score2D(player1Score2D + 1), 
            () => setPlayer2Score2D(player2Score2D + 1))) {
                resetRallyCount(); 
                const gameEnded = checkGameEnd2D(player1Score2D, player2Score2D);
                if (gameSettings2D.resetPaddlePosition && !gameEnded) {
                    paddleLeft.y = (canvas.height - paddleLeft.height) / 2;
                    paddleRight.y = (canvas.height - paddleRight.height) / 2;
                }
                resetBall();
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        drawPaddle(ctx, paddleLeft);
        drawDottedLine(ctx, canvas);
        drawPaddle(ctx, paddleRight);
        drawBall(ctx, ball);
        
        updateAI(ball, paddleRight, canvas);
    }    

    const keys = {};

    function updatePaddleDirection() {
        if (keys['ArrowUp'])
            paddleLeft.dy = -window.paddleSpeed;
        else if (keys['ArrowDown'])
            paddleLeft.dy = window.paddleSpeed;
        else
            paddleLeft.dy = 0;
    }

    function handleKeydown(e) {
        keys[e.key] = true;
        updatePaddleDirection();
    }

    function handleKeyup(e) {
        keys[e.key] = false;
        updatePaddleDirection();
    }

    function movePaddles() {
        // Mouvement du joueur (gauche)
        paddleLeft.y += paddleLeft.dy * paddleLeft.speedFactor;
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height;
    
        // Mouvement de l'IA (droite)
        paddleRight.y += paddleRight.dy * paddleRight.speedFactor;
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        if (paddleRight.y > canvas.height - paddleRight.height)
            paddleRight.y = canvas.height - paddleRight.height;
    }

    // resize canvas and adjust elements
    window.onResizeCanvas = () => resizeCanvas(paddleLeft, paddleRight, ball);
    window.addEventListener('resize', onResizeCanvas);
    onResizeCanvas();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    function gameLoop1Player2D() {
        if (isGameActive2d && isGameStarted()) {
            update();
            movePaddles();
            generatePowerUp(powerUpImageElement, canvas);
        }
        else
            hidePowerUp(powerUpImageElement);

        requestAnimationFrame(gameLoop1Player2D);
    }
    gameLoop1Player2D();
}