// frontend/srcs/js/PongGame/computerIA.js

/* 
    - A algorithm interdit* : Ne pas utiliser l'algorithme A*.
    - Comportement humain : L'IA doit simuler des actions via des entrées clavier.
    - Rafraîchissement toutes les secondes : L'IA ne peut rafraîchir sa vue qu'une fois par seconde.
    - Anticipation : L'IA doit anticiper les rebonds et les actions.
    - Utilisation des power-ups : Si des power-ups sont implémentés, l'IA doit les utiliser.
    - Victoire occasionnelle : L'IA doit être capable de gagner parfois.
    - Explication détaillée : Préparer une explication claire du fonctionnement de l'IA lors de l'évaluation.
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
