// frontend/srcs/js/Screens/1Player.js

import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
import { initializeButton } from '../Modals/settingsModal.js';
import { resizeCanvas } from '../PongGame/resizeCanvas.js';
import { updateAI } from '../PongGame/computerIA.js';
import { gameSettings } from '../PongGame/gameSettings.js';
import { startCountdown } from '../PongGame/chrono.js';
import { drawDottedLine, drawBall, drawPaddle } from '../PongGame/draw.js';
import { handleWallCollision, checkBallOutOfBounds, checkPaddleCollision } from '../PongGame/ballCollision.js';
import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score } from '../PongGame/score.js';

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
    
    let paddleSpeed = gameSettings.canvasHeight * gameSettings.paddleSpeedFactor;
    let ballSpeedX = gameSettings.ballSpeedX;
    let ballSpeedY = gameSettings.ballSpeedY;
  
    const paddleLeft = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0
    };

    const paddleRight = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0
    };

    const ball = {
        x: 0,
        y: 0,
        size: 0,
        dx: 0,
        dy: 0
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
    
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        // Collisions logic
        handleWallCollision(ball, canvas);
        checkPaddleCollision(ball, paddleLeft, paddleRight, () => { ballOutOfBounds = false; });
        
        // Increment scores
        if (checkBallOutOfBounds(ball, canvas, 
            () => setPlayer1Score(player1Score + 1), 
            () => setPlayer2Score(player2Score + 1))) {
                const gameEnded = checkGameEnd(player1Score, player2Score);
                if (gameSettings.resetPaddlePosition && !gameEnded) {
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
        paddleLeft.y += paddleLeft.dy;
    
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height;
    
        // Mouvement de l'IA (droite)
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
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});