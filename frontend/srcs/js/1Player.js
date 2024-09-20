// frontend/srcs/js/1Player.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');

    // Rediriger vers homeScreen.html quand on clique sur Yes
    yesButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    // Rediriger vers 1Player.html quand on clique sur No
    noButton.addEventListener('click', function() {
        window.location.href = '1Player.html';
    });

    let paddleWidth = 25;
    let paddleHeight = 100;
    let ballSize = 12;

    // Variables de vitesse ajustables dynamiquement
    let paddleSpeed = canvas.height * 0.009;
    let ballSpeedX = canvas.width * 0.08;
    let ballSpeedY = canvas.height * 0.08;

    const paddleLeft = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
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
        // Scale the lineWidth and gap based on canvas size
        const lineWidth = canvas.width * 0.016;
        const gap = canvas.height * 0.04;
    
        ctx.strokeStyle = '#a16935';
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([lineWidth, gap]);
    
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
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
        winnerMessage.innerHTML = `Player ${winner} Wins!`;

        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    function checkGameEnd(player1Score, player2Score) {
        const winningScore = 2;
        if (player1Score >= winningScore) {
            showWinMessage(1);
            return true;
        } else if (player2Score >= winningScore) {
            showWinMessage(2);
            return true;
        }
        return false;
    }

    function resetBall() {
        // Reset ball position to the center
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    
        // Dynamically calculate the ball's speed based on canvas size
        ball.dx = window.ballSpeedX = canvas.width * 0.007;
        ball.dy = window.ballSpeedY = canvas.height * 0.007;
    
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
        if (ball.y + ball.size > canvas.height) {
            ball.dy = -ball.dy;  // Reverse vertical direction
            ball.y = canvas.height - ball.size;  // Push ball away from the wall
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
        else if (ball.x + ball.size > canvas.width && !ballOutOfBounds) {
            player1Score++;
            updateScore();
            ballOutOfBounds = true;
            resetBall();
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(paddleLeft);
        drawDottedLine();
        drawPaddle(paddleRight);
        drawBall();
    
        moveComputerPaddle(ball, paddleRight, canvas, paddleSpeed * 0.9);  // AI paddle movement
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
        if (keys['ArrowUp']) {
            paddleLeft.dy = -paddleSpeed;
        } else if (keys['ArrowDown']) {
            paddleLeft.dy = paddleSpeed;
        } else {
            paddleLeft.dy = 0;
        }
    }

    function movePaddles() {
        paddleLeft.y += paddleLeft.dy;

        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height;
    }

    // fonction de pour resize le pong 
    window.onResizeCanvas = () => {
        resizeCanvas(canvas, paddleLeft, paddleRight, ball);
    };

    window.addEventListener('resize', onResizeCanvas);
    onResizeCanvas();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    function gameLoop() {
        update();
        movePaddles();
        requestAnimationFrame(gameLoop);
    }

    gameLoop(); // Start the game loop
});
