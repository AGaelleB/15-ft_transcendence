// frontend/srcs/js/PongGame/ballCollision.js

export function handlePaddleCollision(ball, paddle) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballDistanceFromCenter = ball.y - paddleCenter;

    const impactRatio = ballDistanceFromCenter / (paddle.height / 2);
    const maxBounceAngle = Math.PI / 4;
    const bounceAngle = impactRatio * maxBounceAngle;

    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); 
    ball.dx = speed * Math.cos(bounceAngle) * Math.sign(ball.dx); 
    ball.dy = speed * Math.sin(bounceAngle);
}

export function handleWallCollision(ball, canvas) {
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

export function checkPaddleCollision(ball, paddleLeft, paddleRight, resetOutOfBoundsFlag) {
    // Ball collision with left paddle (Player 1)
    if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
        ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
        ball.dx = -ball.dx;
        ball.x = paddleLeft.x + paddleLeft.width + ball.size;
        handlePaddleCollision(ball, paddleLeft);
        resetOutOfBoundsFlag();
    }

    // Ball collision with right paddle (Player 2 or AI)
    else if (ball.x + ball.size > paddleRight.x &&
        ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
        ball.dx = -ball.dx;
        ball.x = paddleRight.x - ball.size; 
        handlePaddleCollision(ball, paddleRight);
        resetOutOfBoundsFlag();
    }
}

export function checkBallOutOfBounds(ball, canvas, onPlayer1Score, onPlayer2Score) {
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
