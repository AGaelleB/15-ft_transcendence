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

export function moveComputerPaddle(ball, paddleRight, canvas) {
    const aiSpeed = window.paddleSpeed * gameSettings.aiSpeedFactor;

    if (ball.x > canvas.width / 2) {
        const centerOfPaddle = paddleRight.y + paddleRight.height / 2;

        // AI paddle moves at a percentage of the player's speed
        if (ball.y > centerOfPaddle)
            paddleRight.y += aiSpeed;
        else
            paddleRight.y -= aiSpeed;

        // Prevent the AI paddle from going out of bounds
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        else if (paddleRight.y > canvas.height - paddleRight.height)
            paddleRight.y = canvas.height - paddleRight.height;
    }
}
