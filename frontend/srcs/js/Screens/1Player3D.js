// frontend/srcs/js/Screens/1Player3D.js

import { resizeRenderer3D, renderer, camera } from '../PongGame/Game3D/resizeRenderer3D.js';
import { scene, ground, ball, paddleLeft, paddleRight, paddleGeometry } from '../PongGame/Game3D/draw3D.js';


resizeRenderer3D();

/* *************************** Mouvement du paddle ******************************** */

// Mouvement des paddles
const keys = {};

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// limites du mouvement des paddles
const paddleMovementLimit = (ground.geometry.parameters.height / 2.30) - (paddleGeometry.parameters.depth / 2.30);

// Déplacer les raquettes avec limites
function movePaddles() {
    if (keys['ArrowUp']) {
        if (paddleLeft.position.z > -paddleMovementLimit)  // Limite arrière
            paddleLeft.position.z -= 0.3;
    }
    if (keys['ArrowDown']) {
        if (paddleLeft.position.z < paddleMovementLimit)  // Limite avant
            paddleLeft.position.z += 0.3;
    }

    // Mouvement paddle droite (ajouter selon la logique de l'IA ou du joueur 2)
    // Exemple pour le paddle droit si besoin (utiliser d'autres touches si c'est un joueur humain)
    if (keys['w']) {
        if (paddleRight.position.z > -paddleMovementLimit)  // Limite arrière
            paddleRight.position.z -= 0.1;
    }
    if (keys['s']) {
        if (paddleRight.position.z < paddleMovementLimit)  // Limite avant
            paddleRight.position.z += 0.1;
    }
}


/* *************************** Mouvement de la balle ******************************** */


/* ********************************************************************************** */

// boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    movePaddles();
    // moveBall();
    renderer.render(scene, camera);
}

animate();
