// frontend/srcs/js/collisionHandler.js

export function handleBallWallCollision(ball, canvas) {
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

export function handlePaddleCollision(ball, paddle) {
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

export function handleBallPaddleCollision(ball, paddleLeft, paddleRight, canvas, updateScore) {
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
    if (ball.x - ball.size < 0)
        updateScore('player2');
    else if (ball.x + ball.size > canvas.width)
        updateScore('player1');
}
