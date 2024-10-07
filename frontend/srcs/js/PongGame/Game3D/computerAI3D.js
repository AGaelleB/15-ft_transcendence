// frontend/srcs/js/PongGame/Game3D/computerAI3D.js

/*  
    ************************************ OBLIGATIONS DU SUJET ******************************
    - A algorithm interdit* : Ne pas utiliser l'algorithme A*.
    - Comportement humain : L'IA doit simuler des actions via des entrées clavier.
    - Rafraîchissement toutes les secondes 
    - Anticipation : L'IA doit anticiper les rebonds et les actions.
    - Utilisation des power-ups : Si des power-ups sont implémentés, l'IA doit les utiliser.
    - Victoire occasionnelle : L'IA doit être capable de gagner parfois.

    *************** ALGO DE SUIVI PREDICTIF (Predictive Tracking Algorithm) ****************
    Objectif : Prédire où la balle va se trouver à un moment futur et déplacer la raquette de l'IA en fonction
    1- Observer la Balle
    2- Prédire la Trajectoire
    3- Déplacer la Raquette
*/

import { gameSettings3D } from '../gameSettings.js';

const keys = {};
let lastUpdateTime = 0;
const updateInterval = 1000; // 1 second
let targetPositionZ = 0;
const tolerance = 0.5; // Tolerance for avoiding micro-movements

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

// Apply simulated key presses to move the paddle
function IAKeysPress(paddle) {
    if (keys['w'])
        paddle.position.z -= gameSettings3D.paddleSpeed3D;
    else if (keys['s'])
        paddle.position.z += gameSettings3D.paddleSpeed3D;
}

// Check if the AI should update (every second)
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

        // Check for collisions with the top and bottom borders of the ground (Z boundaries)
        if (predictedBallZ >= ground.geometry.parameters.height / 2 || predictedBallZ <= -ground.geometry.parameters.height / 2) {
            predictedBallDz *= -1;
        }
    }
    return predictedBallZ;
}

function predictBallPositionWithError(ball, ground, timeToPaddle) {
    let predictedBallZ = predictBallPositionZ(ball, ground, timeToPaddle);
    predictedBallZ += gameSettings3D.errorMargin;
    return predictedBallZ;
}

// Main function to update AI
export function updateAI3D(ball, paddleRight, ground) {
    // Only update AI when the ball is in the AI's half of the field
    if (ball.position.x > 0) {
        if (shouldUpdateAI()) {
            // Time it will take for the ball to reach the AI paddle
            let timeToPaddle = (paddleRight.position.x - ball.position.x) / gameSettings3D.ballSpeedX3D;
            if (!isFinite(timeToPaddle) || timeToPaddle < 0)
                return;

            // Predict the ball's future position on the Z-axis
            targetPositionZ = predictBallPositionWithError(ball, ground, timeToPaddle);
        }

        // Center of the AI paddle on the Z-axis
        const centerOfPaddle = paddleRight.position.z;

        let direction = null;

        // Move the paddle towards the predicted Z position with some tolerance
        if (Math.abs(targetPositionZ - centerOfPaddle) > tolerance) {
            if (targetPositionZ < centerOfPaddle)
                direction = 'up';
            else if (targetPositionZ > centerOfPaddle)
                direction = 'down';
        }

        // Simulate key presses to move the paddle
        simulateKeyPress(direction);

        // Apply the simulated key presses to move the paddle
        IAKeysPress(paddleRight);
    }
}
