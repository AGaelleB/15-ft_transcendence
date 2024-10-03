// frontend/srcs/js/Screens/1Player3D.js

// import { initializeGameStartListener, isGameStarted } from '../Modals/startGameModal.js';
// import { initializeButton } from '../Modals/settingsModal.js';
// import { resizeCanvas } from '../PongGame/Game2D/resizeCanvas2D.js';
// import { updateAI } from '../PongGame/Game2D/computerAI2D.js';
// import { gameSettings } from '../PongGame/gameSettings.js';
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
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparence du fond
document.body.appendChild(renderer.domElement);

// Ajuster la taille du renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('pongCanvas').appendChild(renderer.domElement);

// Position de la caméra
camera.position.set(0, 12, 10); // Place la caméra plus haut et en arrière
camera.lookAt(0, 0, 0); // Oriente la caméra vers le centre de la scène

// Ajustement dynamique de la size windows
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

//  sol
const groundGeometry = new THREE.PlaneGeometry(30, 10);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotation pour que le plan soit à plat
ground.position.y = -1; // Positionner le sol sous les paddles et la balle
scene.add(ground);

// Éclairage
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5); // Positionner la lumière en hauteur et sur le côté
scene.add(light);

// Création de la balle (sphère)
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);  // Centre de la scène
scene.add(ball);

// Création des raquettes (cubes)
const paddleGeometry = new THREE.BoxGeometry(0.5, 0.5, 3);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleLeft.position.set(-14, 0, 0);  // À gauche de la scène
scene.add(paddleLeft);

const paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleRight.position.set(14, 0, 0);  // À droite de la scène
scene.add(paddleRight);


// Mouvement des paddles
const keys = {}; // Suivre l'état des touches pressées

// Gestion des événements clavier
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Déplacer les raquettes
function movePaddles() {
    if (keys['ArrowUp']) {
        paddleLeft.position.z -= 0.1;
    }
    if (keys['ArrowDown']) {
        paddleLeft.position.z += 0.1;
    }
    // Ajoute un déplacement pour la raquette droite si nécessaire (IA)
}

// boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    movePaddles();
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