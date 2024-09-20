// frontend/srcs/js/1Player.js

import { gameSettings } from './gameSettings.js';
import { resizeCanvas } from './resizeCanvas.js';
import { moveComputerPaddle } from './computerIA.js';

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');

    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');
    const startGameMessage = document.getElementById('startGameMessage');

    // Fonction pour ouvrir le modal de paramètres
    settingsIcon.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    // Fonction pour fermer le modal de paramètres
    closeSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    let gameStarted = false;

    function startGame() {
        startGameMessage.style.display = 'none';
        gameStarted = true;
    }

    document.addEventListener('keydown', (e) => {
        if (!gameStarted && (e.code === 'Space' || e.code === 'Enter')) {
            startGame();
        }
    });

    // Redirection buttons
    yesButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    noButton.addEventListener('click', function() {
        window.location.href = '1Player.html';
    });

    // Initialize game objects using gameSettings
    let paddleWidth = gameSettings.canvasWidth * gameSettings.paddleWidthFactor;
    let paddleHeight = gameSettings.canvasHeight * gameSettings.paddleHeightFactor;
    let ballSize = gameSettings.canvasWidth * gameSettings.ballSizeFactor;

    let paddleSpeed = gameSettings.canvasHeight * gameSettings.paddleSpeedFactor;
    let ballSpeedX = gameSettings.ballSpeedX;
    let ballSpeedY = gameSettings.ballSpeedY;

  
    const paddleLeft = {
        x: 0,
        y: 0,  // Will be set later in resizeCanvas
        width: 0,
        height: 0,
        dy: 0
    };

    const paddleRight = {
        x: 0,  // Will be set later in resizeCanvas
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

    let player1Score = 0;
    let player2Score = 0;
    let ballOutOfBounds = false;

    function drawPaddle(paddle) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
        ctx.closePath();
    }

    function drawDottedLine() {
        const lineWidth = gameSettings.canvasWidth * 0.016;
        const gap = gameSettings.canvasHeight * 0.04;
    
        ctx.strokeStyle = '#a16935';
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([lineWidth, gap]);
    
        ctx.beginPath();
        ctx.moveTo(gameSettings.canvasWidth / 2, 0);
        ctx.lineTo(gameSettings.canvasWidth / 2, gameSettings.canvasHeight);
        ctx.stroke();
        ctx.closePath();
    
        ctx.setLineDash([]);
    }
    

    function updateScore() {
        document.getElementById('player1Score').textContent = player1Score;
        document.getElementById('player2Score').textContent = player2Score;
    }

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
            return true;
        }
        else if (player2Score >= winningScore) {
            showWinMessage(2);
            return true;
        }
        return false;
    }

    function resetBall() {
        ball.x = gameSettings.canvasWidth / 2;
        ball.y = gameSettings.canvasHeight / 2;
    
        ball.dx = gameSettings.ballSpeedX;
        ball.dy = gameSettings.ballSpeedY;
    
        ballOutOfBounds = false;
    }
    
    
    function handlePaddleCollision(ball, paddle) {
        const paddleCenter = paddle.y + paddle.height / 2;
        const ballDistanceFromCenter = ball.y - paddleCenter;
    
        // Calculate the ratio of how far from the center the ball hit
        const impactRatio = ballDistanceFromCenter / (paddle.height / 2); // Between -1 and 1
    
        // Adjust the ball's vertical speed based on the impact ratio
        const maxBounceAngle = Math.PI / 4; // 45 degrees
        const bounceAngle = impactRatio * maxBounceAngle;
    
        // Adjust the ball's dx and dy based on the new bounce angle
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); // Preserve the ball's speed
        ball.dx = speed * Math.cos(bounceAngle) * Math.sign(ball.dx);  // Reverse horizontal direction but keep speed
        ball.dy = speed * Math.sin(bounceAngle);  // Adjust vertical speed based on bounce angle
    }

    function update() {
        const gameEnded = checkGameEnd(player1Score, player2Score);
        if (gameEnded)
            return;
    
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        // Ball collision with top wall
        if (ball.y - ball.size < 0) {
            ball.dy = -ball.dy;  // Reverse vertical direction
            ball.y = ball.size;  // Push ball away from the wall
        }

        // Ball collision with bottom wall
        if (ball.y + ball.size > gameSettings.canvasHeight) {
            ball.dy = -ball.dy;
            ball.y = gameSettings.canvasHeight - ball.size;
        }

        // Ball collision with left paddle (Player 1)
        if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
            ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
            ball.dx = -ball.dx;  // Reverse horizontal direction
            ball.x = paddleLeft.x + paddleLeft.width + ball.size;  // Push ball outside the paddle
            handlePaddleCollision(ball, paddleLeft);
        }

        // Ball collision with right paddle (AI or Player 2)
        if (ball.x + ball.size > paddleRight.x &&
            ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
            ball.dx = -ball.dx;  // Reverse horizontal direction
            ball.x = paddleRight.x - ball.size;  // Push ball outside the paddle
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
    
        ctx.clearRect(0, 0, gameSettings.canvasWidth, gameSettings.canvasHeight);
        drawPaddle(paddleLeft);
        drawDottedLine();
        drawPaddle(paddleRight);
        drawBall();
    
        moveComputerPaddle(ball, paddleRight);
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
            paddleLeft.dy = -window.paddleSpeed;  // Use window.paddleSpeed for consistency
        else if (keys['ArrowDown'])
            paddleLeft.dy = window.paddleSpeed;  // Use window.paddleSpeed for consistency
        else
            paddleLeft.dy = 0;
    }

    function movePaddles() {
        paddleLeft.y += paddleLeft.dy;
    
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > gameSettings.canvasHeight - paddleLeft.height)
            paddleLeft.y = gameSettings.canvasHeight - paddleLeft.height;
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

    gameLoop(); // Start the game loop
});
