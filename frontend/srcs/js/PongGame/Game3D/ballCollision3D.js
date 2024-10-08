// frontend/srcs/js/PongGame/Game3D/ballCollision3D.js

let lastTouchedPaddle = null;

export function getLastTouchedPaddle() {
    return lastTouchedPaddle;
}

export function setLastTouchedPaddle(paddle) {
    if (paddle === 'left' || paddle === 'right' || paddle === null)
        lastTouchedPaddle = paddle;
    else
        console.warn("Invalid paddle value. Use 'left', 'right', or null.");
}

export function handlePaddleCollision3D(ball, paddle) {
    const paddleCenterZ = paddle.position.z;
    const ballDistanceFromCenterZ = ball.position.z - paddleCenterZ;

    // Calculate the impact ratio on the paddle
    const impactRatio = ballDistanceFromCenterZ / (gameSettings3D.paddleDepth3D / 2);
    
    // Max bounce angle (45 degrees in radians)
    const maxBounceAngle = Math.PI / 4;
    
    // Calculate bounce angle
    const bounceAngle = impactRatio * maxBounceAngle;

    // Calculate speed of the ball
    const speed = Math.sqrt(gameSettings3D.ballSpeedX3D ** 2 + gameSettings3D.ballSpeedZ3D ** 2);

    // Update ball's velocity (X and Z components based on the bounce angle)
    ball.position.x = Math.sign(ball.position.x) * speed * Math.cos(bounceAngle); 
    ball.position.z = speed * Math.sin(bounceAngle);
}

export function handleWallCollision3D(ball, groundGeometry) {
    // Check collision with top and bottom walls
    const ballMovementLimitZ = groundGeometry.parameters.height / 2 - gameSettings3D.ballRadius3D;

    // Ball collision with top or bottom walls
    if (ball.position.z >= ballMovementLimitZ || ball.position.z <= -ballMovementLimitZ) {
        gameSettings3D.ballSpeedZ3D = -gameSettings3D.ballSpeedZ3D;
    }
}

export function checkPaddleCollision3D(ball, paddleLeft, paddleRight, resetOutOfBoundsFlag) {
    // Collision with left paddle
    if (
        ball.position.x - gameSettings3D.ballRadius3D <= paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleLeft.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleLeft.position.z - gameSettings3D.paddleDepth3D / 2
    ) {
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;
        ball.position.x = paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 + gameSettings3D.ballRadius3D;
        handlePaddleCollision3D(ball, paddleLeft);
        resetOutOfBoundsFlag();
        setLastTouchedPaddle('left');
    }

    // Collision with right paddle
    if (
        ball.position.x + gameSettings3D.ballRadius3D >= paddleRight.position.x - gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleRight.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleRight.position.z - gameSettings3D.paddleDepth3D / 2
    ) {
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;
        ball.position.x = paddleRight.position.x - gameSettings3D.paddleWidth3D / 2 - gameSettings3D.ballRadius3D;
        handlePaddleCollision3D(ball, paddleRight);
        resetOutOfBoundsFlag();
        setLastTouchedPaddle('right');
    }
}

export function checkBallOutOfBounds3D(ball, groundGeometry, onPlayer1Score, onPlayer2Score) {
    const ballMovementLimitX = groundGeometry.parameters.width / 2 - gameSettings3D.ballRadius3D;

    if (ball.position.x - gameSettings3D.ballRadius3D < -ballMovementLimitX) {
        onPlayer2Score();
        return true;
    }
    if (ball.position.x + gameSettings3D.ballRadius3D > ballMovementLimitX) {
        onPlayer1Score();
        return true;
    }
    return false;
}
