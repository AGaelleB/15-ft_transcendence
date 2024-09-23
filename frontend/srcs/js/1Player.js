// frontend/srcs/js/1Player.js

import { gameSettings } from './gameSettings.js';
import { resizeCanvas } from './resizeCanvas.js';
import { moveComputerPaddle } from './computerIA.js';
import { initializeButton } from './buttonsSettings.js';
import { drawDottedLine, drawBall, drawPaddle } from './draw.js';

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const startGameMessage = document.getElementById('startGameMessage');

    let gameStarted = false;

    let player1Score = 0;
    let player2Score = 0;

    function updateScore() {
        const winningScore = gameSettings.winningScore;
        document.getElementById('player1Score').textContent = `${player1Score} / ${winningScore}`;
        document.getElementById('player2Score').textContent = `${player2Score} / ${winningScore}`;
    }
    updateScore();

    initializeButton();

    function startGame() {
        startGameMessage.style.display = 'none';
        settingsIcon.classList.add('hidden');
        gameStarted = true;
    }

    document.addEventListener('keydown', (e) => {
        if (!gameStarted && (e.code === 'Space' || e.code === 'Enter')) {
            startGame();
        }
    });
    
    // Initialize game objects using gameSettings
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

    function showWinMessage(winner) {
        const winnerMessage = document.querySelector('.message');
        winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    function checkGameEnd(player1Score, player2Score) {
        const winningScore = gameSettings.winningScore;
    
        if (player1Score >= winningScore) {
            showWinMessage(1);
            settingsIcon.classList.remove('hidden');
            return true;
        }
        else if (player2Score >= winningScore) {
            showWinMessage(2);
            settingsIcon.classList.remove('hidden');
            return true;
        }
        return false;
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    
        const direction = Math.floor(Math.random() * 2);
    
        if (direction === 0)
            ball.dx = -window.ballSpeedX;
        else
            ball.dx = window.ballSpeedX;
    
        const verticalDirection = Math.floor(Math.random() * 2);
        if (verticalDirection === 0)
            ball.dy = window.ballSpeedY;
        else
            ball.dy = -window.ballSpeedY;
    
        ballOutOfBounds = false;
    }
    
    function handlePaddleCollision(ball, paddle) {
        const paddleCenter = paddle.y + paddle.height / 2;
        const ballDistanceFromCenter = ball.y - paddleCenter;
    
        // Calculate the ratio of how far from the center the ball hit
        const impactRatio = ballDistanceFromCenter / (paddle.height / 2);
    
        // Adjust the ball's vertical speed based on the impact ratio
        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = impactRatio * maxBounceAngle;
    
        // Adjust the ball's dx and dy based on the new bounce angle
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); 
        ball.dx = speed * Math.cos(bounceAngle) * Math.sign(ball.dx); 
        ball.dy = speed * Math.sin(bounceAngle);
    }

    function update() {
        const gameEnded = checkGameEnd(player1Score, player2Score);
        if (gameEnded)
            return;
    
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        // Ball collision with top wall
        if (ball.y - ball.size < 0) {
            ball.dy = -ball.dy;
            ball.y = ball.size;
        }

        // Ball collision with bottom wall
        if (ball.y + ball.size > canvas.height) {
            ball.dy = -ball.dy;
            ball.y = canvas.height - ball.size;
        }

        // Ball collision with left paddle (Player 1)
        if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
            ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
            ball.dx = -ball.dx;
            ball.x = paddleLeft.x + paddleLeft.width + ball.size;
            handlePaddleCollision(ball, paddleLeft);
        }

        // Ball collision with right paddle (AI or Player 2)
        if (ball.x + ball.size > paddleRight.x &&
            ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
            ball.dx = -ball.dx;
            ball.x = paddleRight.x - ball.size;
            handlePaddleCollision(ball, paddleRight);
        }

        // Ball out of bounds and scoring logic
        if (ball.x - ball.size < 0 && !ballOutOfBounds) {
            player2Score++;
            updateScore();
            ballOutOfBounds = true;
            resetBall();
        }
        else if (ball.x + ball.size > gameSettings.canvasWidth && !ballOutOfBounds) {
            player1Score++;
            updateScore();
            ballOutOfBounds = true;
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
        if (keys['ArrowUp'])
            paddleLeft.dy = -window.paddleSpeed;
        else if (keys['ArrowDown'])
            paddleLeft.dy = window.paddleSpeed;
        else
            paddleLeft.dy = 0;
    }

    function movePaddles() {
        paddleLeft.y += paddleLeft.dy;
    
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height; 
    }

    // Function to resize canvas and adjust elements
    window.onResizeCanvas = () => resizeCanvas(paddleLeft, paddleRight, ball);
    window.addEventListener('resize', onResizeCanvas);
    onResizeCanvas();

    // Game logic and event handling remains unchanged
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    function gameLoop() {
        if (gameStarted) {
            update();
            movePaddles();
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});
