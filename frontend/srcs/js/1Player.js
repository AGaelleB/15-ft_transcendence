// frontend/srcs/js/1Player.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    const paddleWidth = 25;
    const paddleHeight = 100;
    const ballSize = 12;

    let paddleSpeed = 8;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    const paddleLeft = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight
    };

    const paddleRight = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight
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
        const lineWidth = 12;
        const gap = 15;

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
        const winMessage = document.getElementById('winMessage');
        winMessage.querySelector('h1').innerHTML = `Player ${winner} Wins!<br>Congrats!`;
        winMessage.style.display = 'block';
    }
    
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ballSpeedX;
        ball.dy = ballSpeedY;
        ballOutOfBounds = false;
    }

    function moveComputerPaddle() {
        // Simple AI: Move paddle to follow the ball
        if (ball.y > paddleRight.y + paddleRight.height / 2)
            paddleRight.y += 4;
        else
            paddleRight.y -= 4;

        // Prevent paddle from going out of bounds
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        if (paddleRight.y > canvas.height - paddleHeight)
            paddleRight.y = canvas.height - paddleHeight;
    }

    function update() {
        if (player1Score >= 3) {
            showWinMessage(1);
            return;
        }
        else if (player2Score >= 3) {
            showWinMessage(2);
            return;
        }

        // Move the ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom
        if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height)
            ball.dy = -ball.dy;

        // Ball collision with paddles
        if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
            ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
            ball.dx = -ball.dx;
        }

        if (ball.x + ball.size > paddleRight.x &&
            ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
            ball.dx = -ball.dx;
        }

        // Ball out of bounds and scoring
        if (ball.x - ball.size < 0 && !ballOutOfBounds) { // Player 2 scores
            player2Score++;
            updateScore();
            ballOutOfBounds = true; 
            resetBall();
        }
        else if (ball.x + ball.size > canvas.width && !ballOutOfBounds) { // Player 1 scores
            player1Score++;
            updateScore();
            ballOutOfBounds = true;
            resetBall();
        }

        // Clear the canvas and redraw everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(paddleLeft);
        drawDottedLine();
        drawPaddle(paddleRight);
        drawBall();

        // Move the computer paddle if it's a 1-player game
        if (isComputerPlayer)
            moveComputerPaddle();
    }

    function handleKeydown(e) {
        switch(e.key) {
            case 'ArrowUp':
                if (paddleLeft.y > 0)
                    paddleLeft.y -= paddleSpeed;
                break;
            case 'ArrowDown':
                if (paddleLeft.y < canvas.height - paddleHeight)
                    paddleLeft.y += paddleSpeed;
                break;
        }
    }

    // Initialize whether the game is against a computer
    const isComputerPlayer = true; // Set to false for 2-player mode

    document.addEventListener('keydown', handleKeydown);
    setInterval(update, 1000 / 60); // speed game
});
