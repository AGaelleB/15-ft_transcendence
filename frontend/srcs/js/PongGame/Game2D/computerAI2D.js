// frontend/srcs/js/PongGame/Game2D/computerAI2D.js

import { gameSettings2D } from '../gameSettings.js';

const keys = {};
let lastUpdateTime = 0;
const updateInterval = 1000;
let targetPositionY = 0;
const tolerance = 42;

function simulateKeyPress(direction) {
    if (direction === 'up') {
        keys['w'] = true;
        keys['s'] = false;
    }
    else if (direction === 'down') {
        keys['w'] = false;
        keys['s'] = true;
    }
    else {
        keys['w'] = false;
        keys['s'] = false;
    }
}

function IAKeysPress(paddle) {
    if (keys['w'])
        paddle.dy = -window.paddleSpeed;
    else if (keys['s'])
        paddle.dy = window.paddleSpeed;
    else
        paddle.dy = 0;
}

function shouldUpdateAI() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;
        return (true);
    }
    return (false);
}

function predictBallPosition(ball, canvas, timeToPaddle) {
    let predictedBallY = ball.y;
    let predictedBallDy = ball.dy;

    for (let i = 0; i < timeToPaddle; i++) {
        predictedBallY += predictedBallDy;

        if (predictedBallY <= 0 || predictedBallY >= canvas.height)
            predictedBallDy *= -1;
    }
    return (predictedBallY);
}

function predictBallPositionWithError(ball, canvas, timeToPaddle) {
    let predictedBallY = predictBallPosition(ball, canvas, timeToPaddle);
    predictedBallY += gameSettings2D.errorMargin;
    return (predictedBallY);
}

export function updateAI2D(ball, paddleRight, canvas) {
    if (ball.x > canvas.width / 2) {
        if (shouldUpdateAI()) {
            let timeToPaddle = (paddleRight.x - ball.x) / ball.dx;
            if (!isFinite(timeToPaddle) || timeToPaddle < 0)
                return;

            targetPositionY = predictBallPositionWithError(ball, canvas, timeToPaddle);
        }

        const centerOfPaddle = paddleRight.y + paddleRight.height / 2;
        let direction = null;

        // tolérance pour éviter les micro-ajustements
        if (Math.abs(targetPositionY - centerOfPaddle) > tolerance) {
            if (targetPositionY < centerOfPaddle)
                direction = 'up';
            else if (targetPositionY > centerOfPaddle)
                direction = 'down';
        }

        simulateKeyPress(direction);
        IAKeysPress(paddleRight);
    }
}
