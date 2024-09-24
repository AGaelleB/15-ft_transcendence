// buttonsSettings.js

import { gameSettings } from './gameSettings.js';
import { updateScore } from './score.js';

// Variable globale pour indiquer si les paramètres sont ouverts
let isSettingsOpen = false;

// Sauvegarder les paramètres dans localStorage
function saveGameSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
}

// Charger les paramètres depuis localStorage (au redémarrage ou après Play Again)
function loadGameSettings() {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
        Object.assign(gameSettings, JSON.parse(savedSettings));  // Fusionne les paramètres sauvegardés avec ceux actuels
    }
}

function updateSliderValuePosition(sliderId, spanId, multiplier, offset) {
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    // Met à jour la position et le texte de la valeur
    sliderValue.textContent = slider.value * multiplier;
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

// Mettre à jour l'affichage des curseurs et des paramètres à l'ouverture de la page
function updateUIWithGameSettings() {
    document.getElementById('ballSpeed').value = gameSettings.ballSpeedX * 4;
    document.getElementById('paddleSpeed').value = gameSettings.paddleSpeedFactor * 200;
    document.getElementById('pointsToWin').value = gameSettings.winningScore;
    document.getElementById('resetPaddlePosition').checked = gameSettings.resetPaddlePosition;

    if (gameSettings.is3D)
        document.getElementById('game3d').checked = true;
    else
        document.getElementById('game2d').checked = true;

    if (gameSettings.aiSpeedFactor === 0.7)
        document.getElementById('novice').checked = true;
    else if (gameSettings.aiSpeedFactor === 0.9)
        document.getElementById('intermediate').checked = true;
    else if (gameSettings.aiSpeedFactor === 1.2)
        document.getElementById('expert').checked = true;

    // Mettre à jour la position des valeurs des curseurs
    updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
}

loadSettingsOnPageLoad();  // Charger les paramètres depuis localStorage au démarrage

export function initializeButton() {
    const homeButton = document.getElementById('homeButton');
    const againButton = document.getElementById('againButton');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    // Ouvre le modal des paramètres
    settingsIcon.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.add('active');
        settingsModal.style.display = 'flex';
        updateUIWithGameSettings();
        isSettingsOpen = true;
        console.log("Settings opened: isSettingsOpen =", isSettingsOpen);
    });

    // Ferme le modal des paramètres et sauvegarde les nouveaux paramètres
    closeSettingsButton.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings();
        isSettingsOpen = false;
        console.log("Settings closed: isSettingsOpen =", isSettingsOpen);
    });

    // Empêche la propagation de l'événement Enter/Space lorsque les paramètres sont ouverts
    settingsModal.addEventListener('keydown', (e) => {
        if (isSettingsOpen && (e.code === 'Space' || e.code === 'Enter')) {
            console.log("Preventing Enter/Space key press in settings modal");
            e.stopPropagation();
            e.preventDefault();
        }
    });

    // Bouton "Home" redirige vers l'écran d'accueil
    homeButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    // Bouton "Play Again" redirige pour rejouer une partie
    againButton.addEventListener('click', function() {
        saveGameSettings();
        window.location.href = '1Player.html';
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
    
        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
    });

    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        gameSettings.winningScore = Number(event.target.value);
        updateScore();
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
            gameSettings.aiSpeedFactor = 0.7;
        }
    });

    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.aiSpeedFactor = 0.9;
        }
    });

    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings.aiSpeedFactor = 1.2;
        }
    });
}


// Charger les paramètres lors de l'initialisation de la page
export function loadSettingsOnPageLoad() {
    loadGameSettings();
    updateUIWithGameSettings();
}

export function showWinMessage(winner) {
    const winnerMessage = document.querySelector('.message');
    winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
}

let gameStarted = false; // Variable globale pour le statut du jeu

// Fonction pour démarrer le jeu
export function startGame(startGameMessage, settingsIcon) {
    startGameMessage.style.display = 'none';
    settingsIcon.classList.add('hidden');
    gameStarted = true; // Mettre à jour l'état global
}

// Réinitialiser l'état du jeu si nécessaire
export function resetGame() {
    gameStarted = false; // Réinitialiser le statut
    console.log('Game reset: gameStarted =', gameStarted);
}

// Fonction pour ajouter l'écouteur de démarrage du jeu avec les touches
export function initializeGameStartListener(startGameMessage, settingsIcon) {
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && !isSettingsOpen && (e.code === 'Space' || e.code === 'Enter')) {
            startGame(startGameMessage, settingsIcon);
            console.log('Game started with keyboard.');
        }
    });
}

export function isGameStarted() {
    return gameStarted;
}