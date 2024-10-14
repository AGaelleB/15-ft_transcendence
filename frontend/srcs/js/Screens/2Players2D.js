// frontend/srcs/js/Screens/2Players.js

import { initializeGameStartListener2D, isGameStarted } from '../Modals/startGameModal2D.js';
import { initializeButton2D } from '../Modals/settingsModal.js';
import { resizeCanvas } from '../PongGame/Game2D/resizeCanvas2D.js';
import { gameSettings2D } from '../PongGame/gameSettings.js';
import { startCountdown } from '../PongGame/chrono.js';
import { drawDottedLine, drawBall, drawPaddle } from '../PongGame/Game2D/draw2D.js';
import { setLastTouchedPaddle, handleWallCollision, checkBallOutOfBounds, checkPaddleCollision } from '../PongGame/Game2D/ballCollision2D.js';
import { setPlayer1Score2D, setPlayer2Score2D, updateScore2D, checkGameEnd2D, player1Score2D, player2Score2D } from '../PongGame/Game2D/score2D.js';
import { createPowerUpImageElement, generatePowerUp, hidePowerUp, resetPowerUpTimer, applyPowerUpEffect, checkPowerUpCollision, resetPowerUpEffects} from '../PongGame/Game2D/power-ups2D.js';
import { incrementRallyCount, resetRallyCount } from '../PongGame/Game2D/rallyEffect2D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';

export function initialize2Players2D() {
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
        
        // Check collision with power-ups
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
    }    

    const keys = {};

    function handleKeydown(e) {
        keys[e.key] = true;
        updatePaddleDirection();
    }

    function handleKeyup(e) {
        keys[e.key] = false;
        updatePaddleDirection();
    }

    function updatePaddleDirection() {
        // Player 1
        if (keys['w'])
            paddleLeft.dy = -window.paddleSpeed;
        else if (keys['s'])
            paddleLeft.dy = window.paddleSpeed;
        else
            paddleLeft.dy = 0;
    
        // Player 2
        if (keys['ArrowUp'])
            paddleRight.dy = -window.paddleSpeed;
        else if (keys['ArrowDown'])
            paddleRight.dy = window.paddleSpeed;
        else
            paddleRight.dy = 0;
    }
    
    function movePaddles() {
        // Player 1
        paddleLeft.y += paddleLeft.dy;
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height; 
    
        // Player 2
        paddleRight.y += paddleRight.dy;
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

    function gameLoop() {
        if (isGameStarted()) {
            update();
            movePaddles();
            generatePowerUp(powerUpImageElement, canvas);
        }
        else
            hidePowerUp(powerUpImageElement);

        requestAnimationFrame(gameLoop);
    }
    gameLoop();

}
