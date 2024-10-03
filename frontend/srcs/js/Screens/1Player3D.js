// frontend/srcs/js/Screens/1Player3D.js

// import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
// import { initializeButton } from '../Modals/settingsModal.js';
// import { resizeCanvas } from '../PongGame/Game2D/resizeCanvas2D.js';
// import { updateAI } from '../PongGame/Game2D/computerAI2D.js';
import { gameSettings } from '../PongGame/gameSettings.js';
// import { startCountdown } from '../PongGame/chrono.js';
// import { drawDottedLine, drawBall, drawPaddle } from '../PongGame/Game2D/draw2D.js';
// import { setLastTouchedPaddle, handleWallCollision, checkBallOutOfBounds, checkPaddleCollision } from '../PongGame/Game2D/ballCollision2D.js';
// import { setPlayer1Score, setPlayer2Score, updateScore, checkGameEnd, player1Score, player2Score } from '../PongGame/score.js';
// import { createPowerUpImageElement, generatePowerUp, hidePowerUp, resetPowerUpTimer, applyPowerUpEffect, checkPowerUpCollision, resetPowerUpEffects} from '../PongGame/Game2D/power-ups2D.js';
// import { incrementRallyCount, resetRallyCount } from '../PongGame/Game2D/rallyEffect2D.js';
// import { loadLanguages } from '../Modals/switchLanguages.js';

// frontend/srcs/js/Screens/1Player3D.js


// Init la scène, la caméra, 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// creation d un scene avec un rendu (render) transparent
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0); // Transparence du fond
document.body.appendChild(renderer.domElement);


/* ***************************** resizeCanevas3D.js ***************************** */

// Ajuster la taille du renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('pongCanvas').appendChild(renderer.domElement);

// Position de la caméra angle de jeu
camera.position.set(0, 20, 25); // Place la caméra plus haut et en arrière
camera.lookAt(0, 0, 0); // Oriente la caméra vers le centre de la scène

// Position de la caméra du dessus
// camera.position.set(0, 30, 0); // Place la caméra à une hauteur de 20 (ajuster la hauteur selon besoin)
// camera.lookAt(0, 0, 0); // Oriente la caméra vers le centre de la scène
// camera.rotation.order = "YXZ"; // Ajuste l'ordre de rotation pour qu'il n'y ait pas de décalage


// Fonction pour ajuster la taille du renderer
function adjustRendererSize() {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.85;

    let width, height;
    if (containerWidth / containerHeight < gameSettings.aspectRatio) {
        width = containerWidth * gameSettings.canvasWidthFactor;
        height = width / gameSettings.aspectRatio;
    }
    else {
        height = containerHeight * gameSettings.canvasWidthFactor;
        width = height * gameSettings.aspectRatio;
    }

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Ajustement dynamique de la taille lors du redimensionnement de la fenêtre
window.addEventListener('resize', adjustRendererSize);

// Appeler la fonction une première fois au démarrage
adjustRendererSize();

/* *************************** draw game elements ************************ */

//  sol
const groundGeometry = new THREE.PlaneGeometry(60, 20);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x302a66 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotation pour que le plan soit à plat
ground.position.y = -1; // Positionner le sol sous les paddles et la balle
scene.add(ground);

// Éclairage
const light = new THREE.DirectionalLight(0xffcc00, 1);
light.position.set(5, 10, 5); // Positionner la lumière en hauteur et sur le côté
scene.add(light);

// Création de la balle (sphère)
const ballGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);  // Centre de la scène
scene.add(ball);

// Création des raquettes (cubes)
const paddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

const paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleLeft.position.set(-28, 0, 0);  // À gauche de la scène
scene.add(paddleLeft);

const paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleRight.position.set(28, 0, 0);  // À droite de la scène
scene.add(paddleRight);


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

/* *************************** Bordures du jeu ******************************** */

// Créer les bordures autour du terrain de jeu
const borderThickness = 0.5; // Épaisseur des bordures
const borderHeight = paddleGeometry.parameters.height; // Hauteur des bordures, égale à celle des paddles

// Bordure supérieure
const topBorderGeometry = new THREE.BoxGeometry(58.5, borderHeight, borderThickness);
const topBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const topBorder = new THREE.Mesh(topBorderGeometry, topBorderMaterial);
topBorder.position.set(0, 0, -10); // Positionner la bordure en haut du terrain
scene.add(topBorder);

// Bordure inférieure
const bottomBorderGeometry = new THREE.BoxGeometry(58.5, borderHeight, borderThickness);
const bottomBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const bottomBorder = new THREE.Mesh(bottomBorderGeometry, bottomBorderMaterial);
bottomBorder.position.set(0, 0, 10); // Positionner la bordure en bas du terrain
scene.add(bottomBorder);

// Bordure gauche
const leftBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, 20);
const leftBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const leftBorder = new THREE.Mesh(leftBorderGeometry, leftBorderMaterial);
leftBorder.position.set(-29, 0, 0); // Positionner la bordure à gauche du terrain
scene.add(leftBorder);

// Bordure droite
const rightBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, 20);
const rightBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const rightBorder = new THREE.Mesh(rightBorderGeometry, rightBorderMaterial);
rightBorder.position.set(29, 0, 0); // Positionner la bordure à droite du terrain
scene.add(rightBorder);

/* *************************** Paramètres de la ligne centrale ******************************** */

// Paramètres pour la ligne pointillée
const lineLength = 0.5; // Longueur de chaque segment
const gapLength = 0.5; // Espace entre les segments
const totalHeight = ground.geometry.parameters.height; // Hauteur totale de la ligne
const lineWidth = 0.5; // Largeur de la ligne

// Matériau pour la ligne pointillée
const lineMaterial = new THREE.MeshBasicMaterial({ color: '#a16935' });

// Boucle pour créer et ajouter chaque segment
for (let z = -totalHeight / 2; z < totalHeight / 2; z += lineLength + gapLength) {
    // Crée un segment de la ligne
    const segmentGeometry = new THREE.BoxGeometry(lineWidth, 0.01, lineLength); // Largeur et longueur des segments
    const segment = new THREE.Mesh(segmentGeometry, lineMaterial);
    
    // Positionner chaque segment au centre du `ground`
    segment.position.set(0, -0.99, z + lineLength / 2); // Centrer les segments sur l'axe X et positionner sur Z
    
    // Ajouter le segment à la scène
    scene.add(segment);
}



/* *************************** Mouvement de la balle ******************************** */

// // Ajout d'une vitesse en 3D (dx, dy, dz) -> gamesettings
// let ballSpeed = { dx: 0.1, dy: 0.05, dz: 0.1 };


// let lastTouchedPaddle = null;

// export function getLastTouchedPaddle() {
//     return lastTouchedPaddle;
// }

// export function setLastTouchedPaddle(paddle) {
//     if (paddle === 'left' || paddle === 'right' || paddle === null)
//         lastTouchedPaddle = paddle;
//     else
//         console.warn("Invalid paddle value. Use 'left', 'right', or null.");
// }

// export function handlePaddleCollision(ball, paddle) {
//     const paddleCenter = paddle.y + paddle.height / 2;
//     const ballDistanceFromCenter = ball.y - paddleCenter;

//     const impactRatio = ballDistanceFromCenter / (paddle.height / 2);
//     const maxBounceAngle = Math.PI / 4;
//     const bounceAngle = impactRatio * maxBounceAngle;

//     const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); 
//     ball.dx = speed * Math.cos(bounceAngle) * Math.sign(ball.dx); 
//     ball.dy = speed * Math.sin(bounceAngle);
// }

// export function handleWallCollision(ball, canvas) {
//     // Ball collision with top wall
//     if (ball.y - ball.size < 0) {
//         ball.dy = -ball.dy;
//         ball.y = ball.size;
//     }

//     // Ball collision with bottom wall
//     if (ball.y + ball.size > canvas.height) {
//         ball.dy = -ball.dy;
//         ball.y = canvas.height - ball.size;
//     }
// }

// // Fonction pour vérifier les collisions avec les raquettes et mettre à jour le drapeau
// export function checkPaddleCollision(ball, paddleLeft, paddleRight, resetOutOfBoundsFlag) {
//     // Ball collision with left paddle (Player 1)
//     if (ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
//         ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) {
//         ball.dx = -ball.dx;
//         ball.x = paddleLeft.x + paddleLeft.width + ball.size;
//         handlePaddleCollision(ball, paddleLeft);
//         resetOutOfBoundsFlag();
//         setLastTouchedPaddle('left');
//     }

//     // Ball collision with right paddle (Player 2 or AI)
//     else if (ball.x + ball.size > paddleRight.x &&
//         ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height) {
//         ball.dx = -ball.dx;
//         ball.x = paddleRight.x - ball.size; 
//         handlePaddleCollision(ball, paddleRight);
//         resetOutOfBoundsFlag();
//         setLastTouchedPaddle('right');
//     }
// }

// export function checkBallOutOfBounds(ball, canvas, onPlayer1Score, onPlayer2Score) {
//     if (ball.x - ball.size < 0) {
//         onPlayer2Score();
//         return true;
//     }
//     if (ball.x + ball.size > canvas.width) {
//         onPlayer1Score();
//         return true;
//     }
//     return false;
// }

/* ************************************************************* */

// boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    movePaddles();
    // moveBall();
    renderer.render(scene, camera);
}

animate();





























// document.addEventListener('DOMContentLoaded', function() {
//     const canvas = document.getElementById('pongCanvas');
//     const ctx = canvas.getContext('2d');
//     const startGameMessage = document.getElementById('startGameMessage');
//     const settingsIcon = document.getElementById('settingsIcon');
//     const homeIcon = document.getElementById('homeIcon');
//     const powerUpImageElement = createPowerUpImageElement();
//     const storedLang = localStorage.getItem('preferredLanguage') || 'en';
//     loadLanguages(storedLang);

//     homeIcon.addEventListener('click', () => {
//         window.location.href = '/frontend/srcs/html/homeScreen.html';
//     });

//     initializeButton();
//     initializeGameStartListener(startGameMessage, settingsIcon, homeIcon);
    
//     let paddleSpeed = gameSettings.canvasHeight * gameSettings.paddleSpeedFactor;

//     const paddleLeft = {
//         x: 0,
//         y: 0,
//         width: 0,
//         height: 0,
//         dy: 0,
//         speedFactor: gameSettings.paddleSpeedFactor * 25
//     };
    
//     const paddleRight = {
//         x: 0,
//         y: 0,
//         width: 0,
//         height: 0,
//         dy: 0,
//         speedFactor: gameSettings.paddleSpeedFactor * 25
//     };
    
//     const ball = {
//         x: 0,
//         y: 0,
//         size: 0,
//         dx: 0,
//         dy: 0
//     };

//     let ballOutOfBounds = false;

//     function resetBall() {
//         ball.x = canvas.width / 2;
//         ball.y = canvas.height / 2;
    
//         const savedDx = ball.dx;
//         const savedDy = ball.dy;
    
//         setLastTouchedPaddle(null);

//         ball.dx = 0;
//         ball.dy = 0;

//         resetPowerUpEffects(paddleLeft, paddleRight);
//         hidePowerUp(powerUpImageElement);
//         resetPowerUpTimer();
    
//         startCountdown(() => {
//             const direction = Math.floor(Math.random() * 2);
//             if (direction === 0)
//                 ball.dx = -savedDx;
//             else
//                 ball.dx = savedDx;
//             const verticalDirection = Math.floor(Math.random() * 2);
//             if (verticalDirection === 0)
//                 ball.dy = savedDy;
//             else
//                 ball.dy = -savedDy;
//             ballOutOfBounds = false;
//         });
//     }

//     function update() {
//         updateScore(); 
//         const gameEnded = checkGameEnd(player1Score, player2Score);
//         if (gameEnded) {
//             hidePowerUp(powerUpImageElement);
//             return;
//         }
    
//         ball.x += ball.dx;
//         ball.y += ball.dy;
    
//         // Collisions logic
//         handleWallCollision(ball, canvas);
//         checkPaddleCollision(ball, paddleLeft, paddleRight, () => {
//             ballOutOfBounds = false;
//             incrementRallyCount();
//         });
        
//         // Vérification de la collision avec le power-up
//         if (gameSettings.setPowerUps) {
//             if (powerUpImageElement.style.display === 'block' && checkPowerUpCollision(ball, powerUpImageElement, canvas)) {
//                 applyPowerUpEffect(powerUpImageElement.src, paddleLeft, paddleRight);
//                 hidePowerUp(powerUpImageElement);
//             }
//         }

//         // Increment scores
//         if (checkBallOutOfBounds(ball, canvas, 
//             () => setPlayer1Score(player1Score + 1), 
//             () => setPlayer2Score(player2Score + 1))) {
//                 resetRallyCount(); 
//                 const gameEnded = checkGameEnd(player1Score, player2Score);
//                 if (gameSettings.resetPaddlePosition && !gameEnded) {
//                     paddleLeft.y = (canvas.height - paddleLeft.height) / 2;
//                     paddleRight.y = (canvas.height - paddleRight.height) / 2;
//                 }
//                 resetBall();
//         }
    
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//         drawPaddle(ctx, paddleLeft);
//         drawDottedLine(ctx, canvas);
//         drawPaddle(ctx, paddleRight);
//         drawBall(ctx, ball);
        
//         updateAI(ball, paddleRight, canvas);
//     }    

//     const keys = {};

//     function updatePaddleDirection() {
//         if (keys['ArrowUp'])
//             paddleLeft.dy = -window.paddleSpeed;
//         else if (keys['ArrowDown'])
//             paddleLeft.dy = window.paddleSpeed;
//         else
//             paddleLeft.dy = 0;
//     }

//     function handleKeydown(e) {
//         keys[e.key] = true;
//         updatePaddleDirection();
//     }

//     function handleKeyup(e) {
//         keys[e.key] = false;
//         updatePaddleDirection();
//     }

//     function movePaddles() {
//         // Mouvement du joueur (gauche)
//         paddleLeft.y += paddleLeft.dy * paddleLeft.speedFactor;
//         if (paddleLeft.y < 0)
//             paddleLeft.y = 0;
//         if (paddleLeft.y > canvas.height - paddleLeft.height)
//             paddleLeft.y = canvas.height - paddleLeft.height;
    
//         // Mouvement de l'IA (droite)
//         paddleRight.y += paddleRight.dy * paddleRight.speedFactor;
//         if (paddleRight.y < 0)
//             paddleRight.y = 0;
//         if (paddleRight.y > canvas.height - paddleRight.height)
//             paddleRight.y = canvas.height - paddleRight.height;
//     }

//     // resize canvas and adjust elements
//     window.onResizeCanvas = () => resizeCanvas(paddleLeft, paddleRight, ball);
//     window.addEventListener('resize', onResizeCanvas);
//     onResizeCanvas();

//     document.addEventListener('keydown', handleKeydown);
//     document.addEventListener('keyup', handleKeyup);

//     function gameLoop() {
//         if (isGameStarted()) {
//             update();
//             movePaddles();
//             generatePowerUp(powerUpImageElement, canvas);
//         }
//         else
//             hidePowerUp(powerUpImageElement);

//         requestAnimationFrame(gameLoop);
//     }
//     gameLoop();
// });