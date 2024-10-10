// frontend/srcs/js/PongGame/Game3D/resizeRenderer3D.js

import { gameSettings3D } from '../gameSettings.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// creation d un scene avec un renderer
export const renderer = new THREE.WebGLRenderer({ alpha: true });
document.body.appendChild(renderer.domElement);

// Ajuster la taille du renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('pongCanvas').appendChild(renderer.domElement);

// Position de la caméra angle de jeu
camera.position.set(0, 20, 25);
camera.lookAt(0, 0, 0);

// // Position de la caméra du dessus
// camera.position.set(0, 30, 0);
// camera.lookAt(0, 0, 0);
// camera.rotation.order = "YXZ";

// Fonction pour ajuster la taille du renderer
export function resizeRenderer3D() {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.85;

    let width, height;
    if (containerWidth / containerHeight < gameSettings3D.aspectRatio) {
        width = containerWidth * gameSettings3D.canvasWidthFactor;
        height = width / gameSettings3D.aspectRatio;
    }
    else {
        height = containerHeight * gameSettings3D.canvasWidthFactor;
        width = height * gameSettings3D.aspectRatio;
    }

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeRenderer3D);

