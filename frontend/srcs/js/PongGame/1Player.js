// frontend/srcs/js/1Player.js

import { initializeButton, initializeGameStartListener, isGameStarted } from '../Buttons/buttonsSettings.js';
import { resizeCanvas } from './resizeCanvas.js';
import { moveComputerPaddle } from './computerIA.js';
import { gameSettings } from './gameSettings.js';
import { startCountdown } from './chrono.js';
import { drawDottedLine, drawBall, drawPaddle } from './draw.js';
import { handleWallCollision, checkBallOutOfBounds, checkPaddleCollision } from './ballCollision.js';
import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score, isGameOver } from './score.js';

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const startGameMessage = document.getElementById('startGameMessage');
    const settingsIcon = document.getElementById('settingsIcon');
    
    initializeButton();
    initializeGameStartListener(startGameMessage, settingsIcon);

    let paddleWidth = canvas.width * gameSettings.paddleWidthFactor;
    let paddleHeight = canvas.height * gameSettings.paddleHeightFactor;
    let ballSize = canvas.width * gameSettings.ballSizeFactor;
    
    let paddleSpeed = canvas.height * gameSettings.paddleSpeedFactor;
    let ballSpeedX = gameSettings.ballSpeedX;
    let ballSpeedY = gameSettings.ballSpeedY;

    const paddleLeft = {
        x: 0,
        y: 0,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0
    };

    const paddleRight = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0
    };

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: ballSize,
        dx: ballSpeedX,
        dy: ballSpeedY
    };

    let ballOutOfBounds = false;

    // Fonction pour réinitialiser la balle et démarrer le décompte avant de la lancer
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    
        const savedDx = ball.dx;
        const savedDy = ball.dy;
    
        ball.dx = 0;
        ball.dy = 0;
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
        updateScore(); 
        const gameEnded = checkGameEnd(player1Score, player2Score);
        if (gameEnded)
            return;

        // Déplacement de la balle
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Gestion des collisions
        handleWallCollision(ball, canvas);
        checkPaddleCollision(ball, paddleLeft, paddleRight, () => { ballOutOfBounds = false; });
        
        // Vérifie si la balle est hors des limites
        if (checkBallOutOfBounds(ball, canvas, 
            () => setPlayer1Score(player1Score + 1), 
            () => setPlayer2Score(player2Score + 1))) {
            const gameEnded = checkGameEnd(player1Score, player2Score);
            resetBall();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(ctx, paddleLeft);
        drawDottedLine(ctx, canvas);
        drawPaddle(ctx, paddleRight);
        drawBall(ctx, ball);
    
        moveComputerPaddle(ball, paddleRight, canvas);
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
        if (keys['ArrowUp']) paddleLeft.dy = -paddleSpeed;
        else if (keys['ArrowDown']) paddleLeft.dy = paddleSpeed;
        else paddleLeft.dy = 0;
    }

    function movePaddles() {
        paddleLeft.y += paddleLeft.dy;
    
        // Empêche la raquette de sortir des limites
        if (paddleLeft.y < 0) paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height) paddleLeft.y = canvas.height - paddleLeft.height; 
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
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});
