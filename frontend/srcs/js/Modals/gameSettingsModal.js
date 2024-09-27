// frontend/srcs/js/Modals/gameSettingsModal.js

import { gameSettings } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/score.js';
import { resetGame } from './startGameModal.js';

// Variable globale pour indiquer si les paramètres sont ouverts
export let isSettingsOpen = false;

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
        Object.assign(gameSettings, JSON.parse(savedSettings));  // Fusionne les paramètres sauvegardés avec ceux actuels
    }
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
    document.getElementById('pointsToWin').value = gameSettings.winningScore;
    document.getElementById('resetPaddlePosition').checked = gameSettings.resetPaddlePosition;

    if (gameSettings.is3D)
        document.getElementById('game3d').checked = true;
    else
        document.getElementById('game2d').checked = true;

    // Mettre à jour la position des valeurs des curseurs
    updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
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
    
    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        gameSettings.winningScore = Number(event.target.value);
        resetGame();   
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
}

// Charger les paramètres lors de l'initialisation de la page
export function loadSettingsOnPageLoad() {
    loadGameSettings();
    updateUIWithGameSettings();
}
