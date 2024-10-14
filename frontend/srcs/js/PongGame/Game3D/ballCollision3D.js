// frontend/srcs/js/PongGame/Game3D/ballCollision3D.js

import { startCountdown } from '../chrono.js';
import { setPlayer1Score3D, setPlayer2Score3D, updateScore3D, checkGameEnd, player1Score, player2Score } from './score3D.js';
import { gameSettings3D } from '../gameSettings.js';
import { ball, groundGeometry, resetPaddlePosition } from './draw3D.js';

let lastTouchedPaddle = null;
const ballMovementLimitX = groundGeometry.parameters.width / 2 - gameSettings3D.ballRadius3D;

export let isGameActive = true;

export function setIsGameActive(value) {
    if (typeof value === 'boolean')
        isGameActive = value;
    else
        console.warn("Invalid value. Please provide a boolean (true or false).");
}

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
    const ballDistanceFromCenter = ball.position.z - paddleCenterZ;

    const impactRatio = ballDistanceFromCenter / (gameSettings3D.paddleDepth3D / 2);
    const maxBounceAngle = Math.PI / 4; 
    const bounceAngle = impactRatio * maxBounceAngle;

    const speed = Math.sqrt(gameSettings3D.ballSpeedX3D * gameSettings3D.ballSpeedX3D + gameSettings3D.ballSpeedZ3D * gameSettings3D.ballSpeedZ3D);
    
    gameSettings3D.ballSpeedX3D = speed * Math.cos(bounceAngle) * Math.sign(gameSettings3D.ballSpeedX3D);
    gameSettings3D.ballSpeedZ3D = speed * Math.sin(bounceAngle);
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

export function checkPaddleCollision3D(ball, paddleLeft, paddleRight) {
    // Ball collision with left paddle (Player 1)
    if (
        ball.position.x - gameSettings3D.ballRadius3D <= paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleLeft.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleLeft.position.z - gameSettings3D.paddleDepth3D / 2
    ) {
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;
        ball.position.x = paddleLeft.position.x + gameSettings3D.paddleWidth3D / 2 + gameSettings3D.ballRadius3D;
        handlePaddleCollision3D(ball, paddleLeft);
        setLastTouchedPaddle('left');
    }

    // Ball collision with right paddle (Player 2 or AI)
    if (
        ball.position.x + gameSettings3D.ballRadius3D >= paddleRight.position.x - gameSettings3D.paddleWidth3D / 2 &&
        ball.position.z <= paddleRight.position.z + gameSettings3D.paddleDepth3D / 2 &&
        ball.position.z >= paddleRight.position.z - gameSettings3D.paddleDepth3D / 2
    ) {
        gameSettings3D.ballSpeedX3D = -gameSettings3D.ballSpeedX3D;
        ball.position.x = paddleRight.position.x - gameSettings3D.paddleWidth3D / 2 - gameSettings3D.ballRadius3D;
        handlePaddleCollision3D(ball, paddleRight);
        setLastTouchedPaddle('right');
    }
}

function resetBall3D() {
    ball.position.set(0, 0, 0);

    const savedSpeedX = gameSettings3D.ballSpeedX3D;
    const savedSpeedZ = gameSettings3D.ballSpeedZ3D;

    gameSettings3D.ballSpeedX3D = 0;
    gameSettings3D.ballSpeedZ3D = 0;

    // setLastTouchedPaddle(null);
    // resetPowerUpEffects(paddleLeft, paddleRight);
    // hidePowerUp(powerUpImageElement);
    // resetPowerUpTimer();

    if (!checkGameEnd(player1Score, player2Score)) {
        startCountdown(() => {
            let direction;
            if (Math.random() < 0.5)
                direction = -1;
            else
                direction = 1;
            gameSettings3D.ballSpeedX3D = direction * savedSpeedX;
            gameSettings3D.ballSpeedZ3D = savedSpeedZ;
        });
    }
}

export function checkBallOutOfBounds3D() {
    if (ball.position.x >= ballMovementLimitX) {
        setPlayer1Score3D(player1Score + 1);
        resetBall3D();
        if (gameSettings3D.resetPaddlePosition)
            resetPaddlePosition();
        return true;
    }
    if (ball.position.x <= -ballMovementLimitX) {
        setPlayer2Score3D(player2Score + 1);
        resetBall3D();
        if (gameSettings3D.resetPaddlePosition)
            resetPaddlePosition();
        return true;
    }
    updateScore3D();
    const gameEnded = checkGameEnd(player1Score, player2Score);
    if (gameEnded) {
        setIsGameActive(false);
        return;
    }
}