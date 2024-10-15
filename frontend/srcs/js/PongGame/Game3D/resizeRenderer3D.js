// frontend/srcs/js/PongGame/Game3D/resizeRenderer3D.js

import { gameSettings3D } from '../gameSettings.js';

export let renderer, camera;

export function initializeRenderer3D() {
    // Création d'une caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Création d'un renderer avec transparence
    renderer = new THREE.WebGLRenderer({ alpha: true });
    const pongCanvas = document.getElementById('pongCanvas');
    if (pongCanvas) {
        pongCanvas.appendChild(renderer.domElement);
    } else {
        console.error("L'élément 'pongCanvas' est introuvable.");
        return; // Quitter la fonction si le canvas est introuvable
    }

    // Position de la caméra initiale
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);

    // Fonction pour ajuster la taille du renderer
    function resizeRenderer() {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) {
            console.error("L'élément 'game-container' est introuvable.");
            return; // Quitter la fonction si le container est introuvable
        }

        const containerWidth = gameContainer.offsetWidth;
        const containerHeight = window.innerHeight * 0.85;
        
        let width, height;
        if (containerWidth / containerHeight < gameSettings3D.aspectRatio) {
            width = containerWidth * gameSettings3D.canvasWidthFactor;
            height = width / gameSettings3D.aspectRatio;
        } else {
            height = containerHeight * gameSettings3D.canvasWidthFactor;
            width = height * gameSettings3D.aspectRatio;
        }

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Appeler la fonction pour redimensionner le renderer dès le départ
    resizeRenderer();

    // Ajouter un écouteur d'événement pour ajuster la taille du renderer lors du redimensionnement de la fenêtre
    window.addEventListener('resize', resizeRenderer);

    return { renderer, camera };
}
