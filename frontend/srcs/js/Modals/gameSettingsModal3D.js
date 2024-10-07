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

export function loadGameSettingsFromStorage() {
    const savedSettings = localStorage.getItem('gameSettings3D');
    if (savedSettings) {
        Object.assign(gameSettings3D, JSON.parse(savedSettings));
        console.log('Loaded game settings:', gameSettings3D);
    }
}

function resetToDefaultSettings3D() {
    // Réinitialiser les valeurs des paramètres de jeu
    gameSettings3D.ballSpeedX3D = 0.30; // Valeur par défaut pour ballSpeedValue 3
    gameSettings3D.ballSpeedZ3D = 0.30;
    gameSettings3D.paddleSpeed3D = 0.3; // Valeur par défaut pour paddleSpeedValue 3
    gameSettings3D.ballRadius3D = 0.75; // Valeur par défaut pour ballSizeValue 3
    gameSettings3D.paddleWidth3D = 1; // La largeur reste constante
    gameSettings3D.paddleHeight3D = 1.5; // La hauteur reste constante
    gameSettings3D.paddleDepth3D = 5; // Valeur par défaut pour paddleSizeValue 3
    gameSettings3D.winningScore = 5; // Valeur par défaut pour pointsToWinValue 5

    // Mettre à jour les valeurs des variables locales
    ballSpeedValue = 3;
    paddleSpeedValue = 3;
    ballSizeValue = 3;
    paddleSizeValue = 3;
    pointsToWinValue = 5;

    saveGameSettings3D();
    loadGameSettingsFromStorage();
    updateUIWithGameSettings3D();
}


export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) {
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = slider.value * multiplier;
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

export function updateUIWithGameSettings3D() {
    // Convertir la vitesse de la balle pour le slider
    if (gameSettings3D.ballSpeedX3D <= 0.10) ballSpeedValue = 1;
    else if (gameSettings3D.ballSpeedX3D <= 0.20) ballSpeedValue = 2;
    else if (gameSettings3D.ballSpeedX3D <= 0.30) ballSpeedValue = 3;
    else if (gameSettings3D.ballSpeedX3D <= 0.40) ballSpeedValue = 4;
    else ballSpeedValue = 5;

    // Convertir la vitesse de la raquette pour le slider
    if (gameSettings3D.paddleSpeed3D <= 0.1) paddleSpeedValue = 1;
    else if (gameSettings3D.paddleSpeed3D <= 0.2) paddleSpeedValue = 2;
    else if (gameSettings3D.paddleSpeed3D <= 0.3) paddleSpeedValue = 3;
    else if (gameSettings3D.paddleSpeed3D <= 0.4) paddleSpeedValue = 4;
    else paddleSpeedValue = 5;

    // Convertir la taille de la balle pour le slider
    if (gameSettings3D.ballRadius3D <= 0.25) ballSizeValue = 1;
    else if (gameSettings3D.ballRadius3D <= 0.5) ballSizeValue = 2;
    else if (gameSettings3D.ballRadius3D <= 0.75) ballSizeValue = 3;
    else if (gameSettings3D.ballRadius3D <= 1.2) ballSizeValue = 4;
    else ballSizeValue = 5;

    // Convertir la taille de la raquette pour le slider
    if (gameSettings3D.paddleDepth3D <= 2) paddleSizeValue = 1;
    else if (gameSettings3D.paddleDepth3D <= 3.5) paddleSizeValue = 2;
    else if (gameSettings3D.paddleDepth3D <= 5) paddleSizeValue = 3;
    else if (gameSettings3D.paddleDepth3D <= 7.5) paddleSizeValue = 4;
    else paddleSizeValue = 5;

    // Points nécessaires pour gagner
    pointsToWinValue = gameSettings3D.winningScore;

    // Mise à jour des valeurs des sliders/input de l'UI
    document.getElementById('ballSpeed').value = ballSpeedValue;
    document.getElementById('paddleSpeed').value = paddleSpeedValue;
    document.getElementById('pointsToWin').value = pointsToWinValue;
    document.getElementById('ballSize').value = ballSizeValue;
    document.getElementById('paddleSize').value = paddleSizeValue;

    // Mettre à jour les positions et valeurs affichées des sliders/input
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
        
        ball.geometry.dispose();
        ball.geometry = new THREE.SphereGeometry(gameSettings3D.ballRadius3D, 32, 32);
        
        updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
        saveGameSettings3D();
    });
    
   
    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
    
        gameSettings3D.paddleWidth3D = 1;
        gameSettings3D.paddleHeight3D = 1.5;

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
