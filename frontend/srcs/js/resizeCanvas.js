// frontend/srcs/js/resizeCanvas.js

// Fonction pour redimensionner le canvas tout en conservant les proportions
function resizeCanvas(canvas, paddleLeft, paddleRight, ball, aspectRatio = 16 / 9) {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.45;

    // Calculer la nouvelle largeur et hauteur en fonction du ratio 16:9
    if (containerWidth / containerHeight < aspectRatio) {
        canvas.width = containerWidth * 0.9;
        canvas.height = canvas.width / aspectRatio;
    }
    else {
        canvas.height = containerHeight * 0.9;
        canvas.width = canvas.height * aspectRatio;
    }

    // Redimensionner les paddles et la balle en fonction de la nouvelle taille du canvas
    paddleLeft.width = canvas.width * 0.03;
    paddleLeft.height = canvas.height * 0.2;
    paddleRight.width = paddleLeft.width;
    paddleRight.height = paddleLeft.height;

    ball.size = canvas.width * 0.015;

    // Mettre à jour les positions des paddles
    paddleLeft.y = canvas.height / 2 - paddleLeft.height / 2;
    paddleRight.x = canvas.width - paddleRight.width;
    paddleRight.y = canvas.height / 2 - paddleRight.height / 2;

    // Mettre à jour la position de la balle
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Ajuster l'épaisseur de la bordure du canvas
    canvas.style.border = `${Math.max(canvas.width * 0.015, 6)}px solid #a16935`;
}

// Ajouter un event listener pour le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    if (typeof onResizeCanvas === 'function')
        onResizeCanvas();
});
