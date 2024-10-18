// frontend/srcs/js/PongGame/Game3D/computerAI3D.js

import { gameSettings3D } from '../gameSettings.js';

const keys = {};
let lastUpdateTime = 0;
const updateInterval = 1000;
let targetPositionZ = 0;
const tolerance = 0.42;

// Simulate key press for paddle movement
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

function IAKeysPress(paddleRight, ground) {
    const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleRight.paddleDepth3D / 2.30);

    if (keys['w']) {
        if (paddleRight.position.z > -paddleMovementLimit)
            paddleRight.position.z -= paddleRight.speedFactor;
    }
    else if (keys['s']) {
        if (paddleRight.position.z < paddleMovementLimit)
            paddleRight.position.z += paddleRight.speedFactor;
    }
}

function shouldUpdateAI() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;
        return true;
    }
    return false;
}

function predictBallPositionZ(ball, ground, timeToPaddle) {
    let predictedBallZ = ball.position.z;
    let predictedBallDz = gameSettings3D.ballSpeedZ3D;

    for (let i = 0; i < timeToPaddle; i++) {
        predictedBallZ += predictedBallDz;

        if (predictedBallZ >= ground.geometry.parameters.height / 2
            || predictedBallZ <= -ground.geometry.parameters.height / 2)
                predictedBallDz *= -1;
    }
    return predictedBallZ;
}

function predictBallPositionWithError(ball, ground, timeToPaddle) {
    let predictedBallZ = predictBallPositionZ(ball, ground, timeToPaddle);
    predictedBallZ += gameSettings3D.errorMargin3D;
    return predictedBallZ;
}

export function updateAI3D(ball, paddleRight, ground) {
    if (ball.position.x > 0) {
        if (shouldUpdateAI()) {
            let timeToPaddle = (paddleRight.position.x - ball.position.x) / gameSettings3D.ballSpeedX3D;
            if (!isFinite(timeToPaddle) || timeToPaddle < 0)
                return;
            targetPositionZ = predictBallPositionWithError(ball, ground, timeToPaddle);
        }

        const centerOfPaddle = paddleRight.position.z;
        let direction = null;

        // tolérance pour éviter les micro-ajustements
        if (Math.abs(targetPositionZ - centerOfPaddle) > tolerance) {
            if
                (targetPositionZ < centerOfPaddle) direction = 'up';
            else if
                (targetPositionZ > centerOfPaddle) direction = 'down';
        }

        simulateKeyPress(direction);
        IAKeysPress(paddleRight, ground);
    }
}