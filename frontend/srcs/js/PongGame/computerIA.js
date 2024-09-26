// frontend/srcs/js/PongGame/computerIA.js

/*  
    ************************************ OBLIGATION DU SUJET ******************************

    - A algorithm interdit* : Ne pas utiliser l'algorithme A*.
    - Comportement humain : L'IA doit simuler des actions via des entrées clavier.
    - Rafraîchissement toutes les secondes : L'IA ne peut rafraîchir sa vue qu'une fois 
      par seconde.
    - Anticipation : L'IA doit anticiper les rebonds et les actions.
    - Utilisation des power-ups : Si des power-ups sont implémentés, l'IA doit les utiliser.
    - Victoire occasionnelle : L'IA doit être capable de gagner parfois.
    - Explication détaillée : Préparer une explication claire du fonctionnement de l'IA 
      lors de l'évaluation.


    *************** ALGO DE SUIVI PREDICTIF (Predictive Tracking Algorithm) ***************
    
    Objectif : Prédire où la balle va se trouver à un moment futur 
    et déplacer la raquette de l'IA vers cette position pour intercepter la balle.
    
    1- Observer la Balle :
        Position Actuelle : Où se trouve la balle sur l'écran (coordonnées X et Y).
        Vitesse : À quelle vitesse la balle se déplace en X (horizontalement) et en 
        Y (verticalement).
    
    2- Prédire la Trajectoire :
        Calculer où la balle sera après un certain temps (par exemple, 1 seconde).
        Tenir Compte des Rebonds : Si la balle va rebondir contre le haut ou le bas de
        l'écran, ajuster la prédiction en conséquence.
    
    3- Déplacer la Raquette :
        Déplacer la raquette de l'IA vers la position Y prédite pour intercepter la balle.

*/

import { gameSettings } from './gameSettings.js';

let lastUpdateTime = 0;
const updateInterval = 1000; // 1 seconde 
let targetPositionY = 0;

// Fonction qui vérifie si l'IA doit se mettre à jour toutes les secondes
function shouldUpdateAI() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;
        return true;
    }
    return false;
}

// Fonction qui prédit où sera la balle dans une seconde (en tenant compte des rebonds)
function predictBallPosition(ball, canvas, timeToPaddle) {
    let predictedBallY = ball.y;
    let predictedBallDy = ball.dy;

    // Simule la trajectoire de la balle jusqu'à ce qu'elle atteigne la raquette
    for (let i = 0; i < timeToPaddle; i++) {
        predictedBallY += predictedBallDy;

        // Gérer les rebonds sur les murs
        if (predictedBallY <= 0 || predictedBallY >= canvas.height)
            predictedBallDy *= -1;
    }
    return predictedBallY;
}

// Fonction pour déplacer la raquette IA de manière fluide vers la position prédite
function movePaddleIA(paddle, targetPosition, speed, canvas) {
    const centerOfPaddle = paddle.y + paddle.height / 2;

    // Calculer la différence entre la position actuelle et la position cible
    const distance = targetPosition - centerOfPaddle;

    // Ajuster la vitesse en fonction de la distance pour un mouvement fluide
    if (Math.abs(distance) > speed) {
        paddle.y += Math.sign(distance) * speed;
    }
    else {
        paddle.y = targetPosition - paddle.height / 2;
    }

    // Empêche le paddle de sortir du canvas
    if (paddle.y < 0)
        paddle.y = 0;
    else if (paddle.y > canvas.height - paddle.height)
        paddle.y = canvas.height - paddle.height;
}

// Fonction principale qui met à jour l'IA
export function updateAI(ball, paddleRight, canvas) {
    if (ball.x > canvas.width / 2) {
        // Prédit la position de la balle toutes les secondes
        if (shouldUpdateAI()) {
            // Calcule le temps pour que la balle atteigne la raquette
            let timeToPaddle = (paddleRight.x - ball.x) / ball.dx;
            if (!isFinite(timeToPaddle) || timeToPaddle < 0)
                return; // Évite de bouger l'IA si la balle ne va pas vers elle

            // Prédit la position de la balle dans une seconde
            targetPositionY = predictBallPosition(ball, canvas, timeToPaddle);
        }

        // Calcule la vitesse de la raquette (ajustée pour le mouvement fluide)
        const aiSpeed = gameSettings.paddleSpeedFactor * 420; // Ajuster ce facteur selon le besoin

        // Déplacer la raquette de l'IA à chaque frame de manière fluide
        movePaddleIA(paddleRight, targetPositionY, aiSpeed, canvas);
    }
}
