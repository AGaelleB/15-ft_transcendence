// frontend/srcs/js/1Player.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    // Constantes pour les vitesses des éléments
    const PADDLE_SPEED = 6;
    const BALL_SPEED_X = 3;
    const BALL_SPEED_Y = 3;

    let paddleWidth = 25;
    let paddleHeight = 100;
    let ballSize = 12;

    // Variables de vitesse constantes
    let paddleSpeed = PADDLE_SPEED;
    let ballSpeedX = BALL_SPEED_X;
    let ballSpeedY = BALL_SPEED_Y;

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
        }
        else if (player2Score >= winningScore) {
            showWinMessage(2);
            return true;
        }
        return false;
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ballSpeedX;
        ball.dy = ballSpeedY;
        ballOutOfBounds = false;
    }

    function update() {

        const gameEnded = checkGameEnd(player1Score, player2Score);
        if (gameEnded)
            return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height)
            ball.dy = -ball.dy;

        if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
            ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
            ball.dx = -ball.dx;
        }

        if (ball.x + ball.size > paddleRight.x &&
            ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
            ball.dx = -ball.dx;
        }

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
            paddleLeft.dy = -paddleSpeed;
        else if (keys['ArrowDown'])
            paddleLeft.dy = paddleSpeed;
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

    // fonction de pour resize le pong 
    window.onResizeCanvas = () => {
        resizeCanvas(canvas, paddleLeft, paddleRight, ball);
    };

    window.addEventListener('resize', onResizeCanvas);
    onResizeCanvas();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    setInterval(function() {
        update();
        movePaddles();
    }, 1000 / 90);
});
