// frontend/srcs/js/Modals/gameSettingsModal3D.js

import { gameSettings3D } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/Game3D/score3D.js';
import { resetGame } from './startGameModal.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';

// Variable globale pour indiquer si les paramètres sont ouverts
export let isSettingsOpen = false;
let ballSpeedValue = 3;
let paddleSpeedValue = 3;
let ballSizeValue = 3;
let paddleSizeValue = 3;
let pointsToWinValue = 5;

// Getter pour isSettingsOpen
export function getIsSettingsOpen() {
    return isSettingsOpen;
}

// Sauvegarder les paramètres dans localStorage
export function saveGameSettings3D() {
    localStorage.setItem('gameSettings3D', JSON.stringify(gameSettings3D));
}

// Default game settings for reset
const defaultGameSettings = {
    winningScore: 5,
};

function resetToDefaultSettings3D() {
    Object.assign(gameSettings3D, defaultGameSettings);
    saveGameSettings3D();
    updateUIWithGameSettings3D();
}

export function loadGameSettingsFromStorage() {
    const savedSettings = localStorage.getItem('gameSettings3D');
    if (savedSettings) {
        Object.assign(gameSettings3D, JSON.parse(savedSettings));
        console.log('Loaded game settings:', gameSettings3D);
    }
}

export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) {
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = slider.value * multiplier;
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

export function updateUIWithGameSettings3D() {
    document.getElementById('ballSpeed').value = ballSpeedValue;
    document.getElementById('paddleSpeed').value = paddleSpeedValue;
    document.getElementById('pointsToWin').value = pointsToWinValue;
    document.getElementById('ballSize').value = ballSizeValue;
    document.getElementById('paddleSize').value = paddleSizeValue;


    updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
    updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
    updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
    updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
}

export function initializeGameSettings3D() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    settingsIcon.addEventListener('click', () => {
        if (!isSettingsOpen) {
            document.querySelector('.settings-modal-container').classList.add('active');
            settingsModal.style.display = 'flex';
            updateUIWithGameSettings3D();
            isSettingsOpen = true;
        }
        else {
            document.querySelector('.settings-modal-container').classList.remove('active');
            settingsModal.style.display = 'none';
            saveGameSettings3D();
            isSettingsOpen = false;
        }
    });

    closeSettingsButton.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings3D();
        isSettingsOpen = false;
    });

    updateScore();

    document.getElementById('resetSettings').addEventListener('click', () => {
        resetToDefaultSettings3D();
    });

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);

        switch (ballSpeed) {
            case 1:
                gameSettings3D.ballSpeedX3D = 0.10;
                gameSettings3D.ballSpeedZ3D = 0.10;
                break;
            case 2:
                gameSettings3D.ballSpeedX3D = 0.20;
                gameSettings3D.ballSpeedZ3D = 0.20;
                break;
            case 3:
                gameSettings3D.ballSpeedX3D = 0.30;
                gameSettings3D.ballSpeedZ3D = 0.30;
                break;
            case 4:
                gameSettings3D.ballSpeedX3D = 0.40;
                gameSettings3D.ballSpeedZ3D = 0.40;
                break;
            case 5:
                gameSettings3D.ballSpeedX3D = 0.55;
                gameSettings3D.ballSpeedZ3D = 0.55;
                break;
        }

        updateSliderValuePosition('ballSpeed', 'ballSpeedValue', 1, 16);
        saveGameSettings3D();
    });
    
    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        
        switch (paddleSpeed) {
            case 1:
                gameSettings3D.paddleSpeed3D = 0.1;
                break;
            case 2:
                gameSettings3D.paddleSpeed3D = 0.2;
                break;
            case 3:
                gameSettings3D.paddleSpeed3D = 0.3;
                break;
            case 4:
                gameSettings3D.paddleSpeed3D = 0.4;
                break;
            case 5:
                gameSettings3D.paddleSpeed3D = 0.5;
                break;
        }

        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
        saveGameSettings3D();
    });


    document.getElementById('ballSize').addEventListener('input', function (event) {
        ballSizeValue = Number(event.target.value);
    
        switch (ballSizeValue) {
            case 1:
                gameSettings3D.ballRadius3D = 0.25;
                break;
            case 2:
                gameSettings3D.ballRadius3D = 0.5;
                break;
            case 3:
                gameSettings3D.ballRadius3D = 0.75;
                break;
            case 4:
                gameSettings3D.ballRadius3D = 1.2;
                break;
            case 5:
                gameSettings3D.ballRadius3D = 1.75;
                break;
        }
        
        // Mise à jour de la géométrie de la balle
        ball.geometry.dispose(); // Supprime l'ancienne géométrie pour libérer la mémoire
        ball.geometry = new THREE.SphereGeometry(gameSettings3D.ballRadius3D, 32, 32);
        
        updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
        saveGameSettings3D();
    });
    
   
    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
    
        gameSettings3D.paddleWidth3D = 1; // La largeur reste constante
        gameSettings3D.paddleHeight3D = 1.5; // La hauteur reste constante
    
        // Apply 3D changes for the paddle size
        switch (paddleSizeValue) {
            case 1:
                gameSettings3D.paddleDepth3D = 2;
                break;
            case 2:
                gameSettings3D.paddleDepth3D = 3.5;
                break;
            case 3:
                gameSettings3D.paddleDepth3D = 5;
                break;
            case 4:
                gameSettings3D.paddleDepth3D = 7.5;
                break;
            case 5:
                gameSettings3D.paddleDepth3D = 10;
                break;
        }
        
        // Mise à jour de la géométrie des raquettes
        paddleLeft.geometry.dispose();
        paddleRight.geometry.dispose();
        
        const newPaddleGeometry = new THREE.BoxGeometry(gameSettings3D.paddleWidth3D, gameSettings3D.paddleHeight3D, gameSettings3D.paddleDepth3D);
        paddleLeft.geometry = newPaddleGeometry;
        paddleRight.geometry = newPaddleGeometry;
        
        updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
        saveGameSettings3D();
    });

    loadSettingsOnPageLoad3D();
    resetGame();

    // Gestion des points nécessaires pour gagner
    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        pointsToWinValue = Number(event.target.value);
        gameSettings3D.winningScore = pointsToWinValue;
        saveGameSettings3D();
    });

    // Réinitialiser la position des paddles à chaque point
    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings3D.resetPaddlePosition = event.target.checked;
        saveGameSettings3D();
    });

    loadSettingsOnPageLoad3D();
    resetGame();
}

export function loadSettingsOnPageLoad3D() {
    updateUIWithGameSettings3D();
}
