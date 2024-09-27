// frontend/srcs/js/Modals/gameSettingsModal.js

import { gameSettings } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/score.js';
import { resetGame } from './startGameModal.js';

// Variable globale pour indiquer si les paramètres sont ouverts
export let isSettingsOpen = false;
let ballSizeValue = 3;
let paddleSizeValue = 3;
let pointsToWinValue = 0;

// Getter pour isSettingsOpen
export function getIsSettingsOpen() {
    return isSettingsOpen;
}

// Sauvegarder les paramètres dans localStorage
export function saveGameSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
}

// Charger les paramètres depuis localStorage (au redémarrage ou après Play Again)
export function loadGameSettings() {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
        Object.assign(gameSettings, JSON.parse(savedSettings));
    }

    pointsToWinValue = gameSettings.winningScore;
    ballSizeValue = gameSettings.ballSizeFactor / 0.015 * 3; // Reconvertir à l'échelle 1-5
    paddleSizeValue = gameSettings.paddleHeightFactor / 0.25 * 3; // Reconvertir à l'échelle 1-5

    switch (gameSettings.difficultyLevel) {
        case "novice":
            document.getElementById('novice').checked = true;
            break;
        case "intermediate":
            document.getElementById('intermediate').checked = true;
            break;
        case "expert":
            document.getElementById('expert').checked = true;
            break;
    }
}


// Met à jour la taille de la balle en fonction de la valeur ballSizeValue
function updateBallSize() {
    gameSettings.ballSizeFactor = 0.015 * (ballSizeValue / 3); // 3 est la valeur par défaut
    document.getElementById('ballSizeValue').textContent = ballSizeValue;
    // Applique les changements sur la balle (si besoin dans ton jeu)
}

// Met à jour la taille de la raquette en fonction de la valeur paddleSizeValue
function updatePaddleSize() {
    gameSettings.paddleHeightFactor = 0.25 * (paddleSizeValue / 3); // 3 est la valeur par défaut
    document.getElementById('paddleSizeValue').textContent = paddleSizeValue;
    // Applique les changements sur la raquette (si besoin dans ton jeu)
}

export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) { 
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    // Met à jour la position et le texte de la valeur
    sliderValue.textContent = (slider.value * multiplier) - 2; // Affichage de la valeur décalée
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

// Mettre à jour l'affichage des curseurs et des paramètres à l'ouverture de la page
export function updateUIWithGameSettings() {
    document.getElementById('ballSpeed').value = gameSettings.ballSpeedX * 4;
    document.getElementById('paddleSpeed').value = gameSettings.paddleSpeedFactor * 200;
    document.getElementById('pointsToWinValue').textContent = gameSettings.winningScore; // Correction ici
    pointsToWinValue = gameSettings.winningScore; // Assurer la synchronisation
    document.getElementById('resetPaddlePosition').checked = gameSettings.resetPaddlePosition;

    // Met à jour l'affichage des tailles de balle et de raquette
    document.getElementById('ballSizeValue').textContent = ballSizeValue;
    document.getElementById('paddleSizeValue').textContent = paddleSizeValue;

    if (gameSettings.is3D)
        document.getElementById('game3d').checked = true;
    else
        document.getElementById('game2d').checked = true;

    // Mettre à jour la position des valeurs des curseurs
    updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
}

function updatePointsToWin() {
    document.getElementById('pointsToWinValue').textContent = pointsToWinValue;
    gameSettings.winningScore = pointsToWinValue;
}


export function initializeGameSettings() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    // Ouvre le modal des paramètres
    settingsIcon.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.add('active');
        settingsModal.style.display = 'flex';
        saveGameSettings();
        updateUIWithGameSettings();
        isSettingsOpen = true;
    });

    // Ferme le modal des paramètres et sauvegarde les nouveaux paramètres
    closeSettingsButton.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings();
        resetGame();
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

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);
        gameSettings.ballSpeedX = ballSpeed / 4;
        gameSettings.ballSpeedY = ballSpeed / 4;

        updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
    });
    
    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        gameSettings.paddleSpeedFactor = paddleSpeed / 200;
    
        // // Synchronize AI paddle speed with player paddle speed
        // gameSettings.aiSpeedFactor = gameSettings.paddleSpeedFactor;
    
        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
    });
    
    // Écouteur pour décrémenter les points à gagner
    document.getElementById('decreasePoints').addEventListener('click', function () {
        console.log('Decrease clicked'); // Pour vérifier si le clic fonctionne
        if (pointsToWinValue > 1) {
            pointsToWinValue--;
            updatePointsToWin();
            resetGame();
            updateScore();
        }
    });
    
    document.getElementById('increasePoints').addEventListener('click', function () {
        console.log('Increase clicked'); // Pour vérifier si le clic fonctionne
        if (pointsToWinValue < 10) {
            pointsToWinValue++;
            updatePointsToWin();
            resetGame();
            updateScore();
        }
    });
    

    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings.resetPaddlePosition = event.target.checked;
    });    

    document.getElementById('game2d').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.is3D = false;
        }
    });

    document.getElementById('game3d').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.is3D = true;
        }
    });

    document.getElementById('novice').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.errorMargin = Math.random() * 200 - 100;
        }
    });

    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.errorMargin = Math.random() * 150 - 75;
        }
    });

    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.errorMargin = Math.random() * 50 - 25;
        }
    });

    document.getElementById('decreaseBallSize').addEventListener('click', function () {
        if (ballSizeValue > 1) {
            ballSizeValue--;
            updateBallSize();
        }
    });

    document.getElementById('increaseBallSize').addEventListener('click', function () {
        if (ballSizeValue < 5) {
            ballSizeValue++;
            updateBallSize();
        }
    });

    // Ajuster la taille de la raquette
    document.getElementById('decreasePaddleSize').addEventListener('click', function () {
        if (paddleSizeValue > 1) {
            paddleSizeValue--;
            updatePaddleSize();
        }
    });

    document.getElementById('increasePaddleSize').addEventListener('click', function () {
        if (paddleSizeValue < 5) {
            paddleSizeValue++;
            updatePaddleSize();
        }
    });
}

// Charger les paramètres lors de l'initialisation de la page
export function loadSettingsOnPageLoad() {
    loadGameSettings();
    updateUIWithGameSettings();
}
