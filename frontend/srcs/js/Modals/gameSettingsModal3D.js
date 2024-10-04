// frontend/srcs/js/Modals/gameSettingsModal2D.js

import { gameSettings } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/score.js';
import { updateBallMovementLimits, updatePaddleMovementLimits } from '../Screens/1Player3D.js';
import { paddleGeometry } from '../PongGame/Game3D/draw3D.js';


function saveGameSettings() {
    // Mettre à jour la taille de la balle
    let ballSizeValue = Number(document.getElementById('ballSize').value);
    let newBallGeometry;
    switch (ballSizeValue) {
        case 1:
            newBallGeometry = new THREE.SphereGeometry(0.25, 32, 32);
            break;
        case 2:
            newBallGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case 3:
            newBallGeometry = new THREE.SphereGeometry(0.75, 32, 32);
            break;
        case 4:
            newBallGeometry = new THREE.SphereGeometry(1.2, 32, 32);
            break;
        case 5:
            newBallGeometry = new THREE.SphereGeometry(1.75, 32, 32);
            break;
        default:
            newBallGeometry = new THREE.SphereGeometry(0.75, 32, 32);
            break;
    }
    ball.geometry.dispose();
    ball.geometry = newBallGeometry;
    gameSettings.ballRadius = newBallGeometry.parameters.radius;

    // Mettre à jour la taille des paddles
    let paddleSizeValue = Number(document.getElementById('paddleSize').value);
    let newPaddleGeometry;
    switch (paddleSizeValue) {
        case 1:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 2);
            break;
        case 2:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 3.5);
            break;
        case 3:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
            break;
        case 4:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 7.5);
            break;
        case 5:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 10);
            break;
        default:
            newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
            break;
    }
    paddleLeft.geometry.dispose();
    paddleLeft.geometry = newPaddleGeometry;
    paddleRight.geometry.dispose();
    paddleRight.geometry = newPaddleGeometry;
    gameSettings.paddleDepth = newPaddleGeometry.parameters.depth;

    // Mettre à jour les limites de mouvement
    updateBallMovementLimits();
    updatePaddleMovementLimits();

    console.log("Game settings saved:", gameSettings);
}


export function initializeGameSettings() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    // Ouvre le modal des paramètres
    // Ouvre ou ferme le modal des paramètres
    settingsIcon.addEventListener('click', () => {
        if (!isSettingsOpen) {
            // Ouvrir le modal
            document.querySelector('.settings-modal-container').classList.add('active');
            settingsModal.style.display = 'flex';
            updateUIWithGameSettings(); // Met à jour l'UI lors de l'ouverture du modal
            isSettingsOpen = true;
        }
        else {
            // Fermer le modal (comme le bouton 'Close')
            document.querySelector('.settings-modal-container').classList.remove('active');
            settingsModal.style.display = 'none';
            
            saveGameSettings();
            loadGameSettings();

            // Recharger la page pour forcer l'application des nouveaux paramètres
            window.location.reload();
            
            isSettingsOpen = false;
        }
    });

    // Ferme le modal des paramètres et sauvegarde les nouveaux paramètres
    closeSettingsButton.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        
        saveGameSettings();
        loadGameSettings();

        // Recharger la page pour forcer l'application des nouveaux paramètres
        window.location.reload();
        
        isSettingsOpen = false;
    });
    
    // Empêche la propagation de l'événement Enter/Space lorsque les paramètres sont ouverts
    settingsModal.addEventListener('keydown', (e) => {
        if (isSettingsOpen && (e.code === 'Space' || e.code === 'Enter')) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

    updateScore();

    document.getElementById('game2d').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.is3D = false;
        }
        saveGameSettings();
    });

    document.getElementById('game3d').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.is3D = true;
        }
        saveGameSettings();
    });

    document.getElementById('novice').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.difficultyLevel = "novice"; 
            gameSettings.errorMargin = Math.random() * 200 - 100;
            saveGameSettings();
        }
    });
    
    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.difficultyLevel = "intermediate"; 
            gameSettings.errorMargin = Math.random() * 150 - 75;
            saveGameSettings();
        }
    });
    
    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.difficultyLevel = "expert"; 
            gameSettings.errorMargin = Math.random() * 50 - 25;
            saveGameSettings();
        }
    });    

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);
        gameSettings.ballSpeedX = ballSpeed / 4;
        gameSettings.ballSpeedY = ballSpeed / 4;
        updateSliderValuePositionSpeed('ballSpeed', 'ballSpeedValue', 1, 16);
        saveGameSettings();
    });
    
    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        
        // Utiliser la fonction de mappage simple
        gameSettings.paddleSpeedFactor = mapPaddleSpeed(paddleSpeed);
        
        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
        saveGameSettings();
    });

    document.getElementById('ballSize').addEventListener('input', function (event) {
        ballSizeValue = Number(event.target.value);
        
        // Créer une nouvelle géométrie en fonction de la valeur du slider
        let newBallGeometry;
        switch (ballSizeValue) {
            case 1:
                newBallGeometry = new THREE.SphereGeometry(0.25, 32, 32);
                break;
            case 2:
                newBallGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                break;
            case 3:
                newBallGeometry = new THREE.SphereGeometry(0.75, 32, 32);
                break;
            case 4:
                newBallGeometry = new THREE.SphereGeometry(1.2, 32, 32);
                break;
            case 5:
                newBallGeometry = new THREE.SphereGeometry(1.75, 32, 32);
                break;
            default:
                newBallGeometry = new THREE.SphereGeometry(0.75, 32, 32);
                break;
        }
        
        // Remplacer la géométrie de la balle dans la scène
        ball.geometry.dispose(); // Libérer la mémoire de l'ancienne géométrie
        ball.geometry = newBallGeometry; // Appliquer la nouvelle géométrie
        
        // Recalculer les limites de mouvement de la balle
        gameSettings.ballRadius = newBallGeometry.parameters.radius;
        updateBallMovementLimits();
    
        saveGameSettings();
    });
    
 
    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
        
        let newPaddleGeometry;
        switch (paddleSizeValue) {
            case 1:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 2);
                break;
            case 2:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 3.5);
                break;
            case 3:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
                break;
            case 4:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 7.5);
                break;
            case 5:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 10);
                break;
            default:
                newPaddleGeometry = new THREE.BoxGeometry(1, 1.5, 5);
                break;
        }
        
        // Remplacer la géométrie des paddles
        paddleLeft.geometry.dispose();
        paddleLeft.geometry = newPaddleGeometry;
    
        paddleRight.geometry.dispose();
        paddleRight.geometry = newPaddleGeometry;
        
        // Recalculer les limites de mouvement des paddles
        gameSettings.paddleDepth = newPaddleGeometry.parameters.depth;
        updatePaddleMovementLimits();
    
        saveGameSettings();
    });
    
    
    
    
    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        pointsToWinValue = Number(event.target.value);
        gameSettings.winningScore = pointsToWinValue;
        updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
        updateScore();
        saveGameSettings();
    });

    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings.resetPaddlePosition = event.target.checked;
        saveGameSettings();
    });
    
    document.getElementById('setPowerUps').addEventListener('change', function (event) {
        gameSettings.setPowerUps = event.target.checked;
        saveGameSettings();
    });
    
    document.getElementById('setRally').addEventListener('change', function (event) {
        gameSettings.setRally = event.target.checked;
        saveGameSettings();
    });

    console.log("Settings after load:", gameSettings);
}
