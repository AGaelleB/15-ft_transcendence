// frontend/srcs/js/PongGame/computerIA.js

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

import { gameSettings } from './gameSettings.js';

const keys = {};
let lastUpdateTime = 0;
const updateInterval = 1000; // 1 seconde 
let targetPositionY = 0;
const tolerance = 15; // tolerence pour éviter les micro-mouvements

// Simule l'appui sur les touches 'w' et 's'
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

// Applique les mouvements du paddle en fonction des touches pressées
function IAKeysPress(paddle) {
    if (keys['w'])
        paddle.dy = -window.paddleSpeed;
    else if (keys['s'])
        paddle.dy = window.paddleSpeed;
    else
        paddle.dy = 0;
}

// Vérifie si l'IA doit se mettre à jour (toutes les secondes)
function shouldUpdateAI() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;
        return (true);
    }
    return (false);
}

// Prédit où sera la balle en tenant compte des rebonds
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

// Ajoute une marge d'erreur à la prédiction
function predictBallPositionWithError(ball, canvas, timeToPaddle) {
    let predictedBallY = predictBallPosition(ball, canvas, timeToPaddle);
    predictedBallY += gameSettings.errorMargin;
    return (predictedBallY);
}

// Fonction principale qui met à jour l'IA
export function updateAI(ball, paddleRight, canvas) {
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

        // Simule l'appui sur les touches
        simulateKeyPress(direction);

        // Applique les mouvements simulés à la raquette
        IAKeysPress(paddleRight);
    }
}
