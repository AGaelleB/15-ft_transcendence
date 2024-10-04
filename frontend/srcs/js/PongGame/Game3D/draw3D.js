// frontend/srcs/js/PongGame/Game3D/draw3D.js


// Init la scène, la caméra, 
export const scene = new THREE.Scene();

/* *************************** draw game elements ************************ */

//  sol
export const groundGeometry = new THREE.PlaneGeometry(60, 20);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x302a66 });
export const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Éclairage
const light = new THREE.DirectionalLight(0xffcc00, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Création de la balle (sphère)
export const ballGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
export const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);
scene.add(ball);

// Création des raquettes (cubes)
export const paddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

export const paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleLeft.position.set(-28, 0, 0);
scene.add(paddleLeft);

export const paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddleRight.position.set(28, 0, 0);
scene.add(paddleRight);

/* *************************** Bordures du jeu ******************************** */

// Créer les bordures autour du terrain de jeu
const borderThickness = 0.5;
const borderHeight = paddleGeometry.parameters.height;

// Bordure supérieure
const topBorderGeometry = new THREE.BoxGeometry(58.5, borderHeight, borderThickness);
const topBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const topBorder = new THREE.Mesh(topBorderGeometry, topBorderMaterial);
topBorder.position.set(0, 0, -10);
scene.add(topBorder);

// Bordure inférieure
const bottomBorderGeometry = new THREE.BoxGeometry(58.5, borderHeight, borderThickness);
const bottomBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const bottomBorder = new THREE.Mesh(bottomBorderGeometry, bottomBorderMaterial);
bottomBorder.position.set(0, 0, 10);
scene.add(bottomBorder);

// Bordure gauche
const leftBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, 20);
const leftBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const leftBorder = new THREE.Mesh(leftBorderGeometry, leftBorderMaterial);
leftBorder.position.set(-29, 0, 0);
scene.add(leftBorder);

// Bordure droite
const rightBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, 20);
const rightBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xa16935 });
const rightBorder = new THREE.Mesh(rightBorderGeometry, rightBorderMaterial);
rightBorder.position.set(29, 0, 0);
scene.add(rightBorder);

/* *************************** Paramètres de la ligne centrale ******************************** */

// Paramètres pour la ligne pointillée
const lineLength = 1;
const gapLength = 1;
const totalHeight = ground.geometry.parameters.height;
const lineWidth = 1;

// Matériau pour la ligne pointillée
const lineMaterial = new THREE.MeshBasicMaterial({ color: '#a16935' });

// Boucle pour créer et ajouter chaque segment
for (let z = -totalHeight / 2; z < totalHeight / 2; z += lineLength + gapLength) {
    const segmentGeometry = new THREE.BoxGeometry(lineWidth, 0.01, lineLength);
    const segment = new THREE.Mesh(segmentGeometry, lineMaterial);
    segment.position.set(0, -0.99, z + lineLength / 2);
    scene.add(segment);
}