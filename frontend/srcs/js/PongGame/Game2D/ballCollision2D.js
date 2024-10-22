// frontend/srcs/js/PongGame/Game2D/ballCollision2D.js

let lastTouchedPaddle = null;

export function getLastTouchedPaddle2D() {
    return lastTouchedPaddle;
}

export function setLastTouchedPaddle2D(paddle) {
    if (paddle === 'left' || paddle === 'right' || paddle === null)
        lastTouchedPaddle = paddle;
    else
        console.warn("Invalid paddle value. Use 'left', 'right', or null.");
}

export function handlePaddleCollision2D(ball, paddle) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballDistanceFromCenter = ball.y - paddleCenter;

    const impactRatio = ballDistanceFromCenter / (paddle.height / 2);
    const maxBounceAngle = Math.PI / 4;
    const bounceAngle = impactRatio * maxBounceAngle;

    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); 
    ball.dx = speed * Math.cos(bounceAngle) * Math.sign(ball.dx); 
    ball.dy = speed * Math.sin(bounceAngle);
}

export function handleWallCollision2D(ball, canvas) {
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
}

export function checkPaddleCollision2D(ball, paddleLeft, paddleRight, resetOutOfBoundsFlag) {
    // Ball collision with left paddle (Player 1)
    if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
        ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
        ball.dx = -ball.dx;
        ball.x = paddleLeft.x + paddleLeft.width + ball.size;
        handlePaddleCollision2D(ball, paddleLeft);
        resetOutOfBoundsFlag();
        setLastTouchedPaddle2D('left');
    }

    // Ball collision with right paddle (Player 2 or AI)
    else if (ball.x + ball.size > paddleRight.x &&
        ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
        ball.dx = -ball.dx;
        ball.x = paddleRight.x - ball.size; 
        handlePaddleCollision2D(ball, paddleRight);
        resetOutOfBoundsFlag();
        setLastTouchedPaddle2D('right');
    }
}

export function checkBallOutOfBounds2D(ball, canvas, onPlayer1Score, onPlayer2Score) {
    if (ball.x - ball.size < 0) {
        onPlayer2Score();
        return true;
    }
    if (ball.x + ball.size > canvas.width) {
        onPlayer1Score();
        return true;
    }
    return false;
}
