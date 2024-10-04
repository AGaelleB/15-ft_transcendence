// frontend/srcs/js/Modals/gameSettingsModal3D.js

import { gameSettings } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/score.js';
import { resetGame } from './startGameModal.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';

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
export function saveGameSettings3D() {
    localStorage.setItem('gameSettings3D', JSON.stringify(gameSettings));
}

// Default game settings for reset
const defaultGameSettings = {
    is3D: true,  // Ensure this is set to true for 3D game
    difficultyLevel: "intermediate",
    ballSizeFactor: 0.015,
    paddleHeightFactor: 0.25,
    winningScore: 5,
    resetPaddlePosition: true,
    setPowerUps: false,
    setRally: false,
};

function resetToDefaultSettings3D() {
    Object.assign(gameSettings, defaultGameSettings);
    saveGameSettings3D();
    loadGameSettings3D();
    updateUIWithGameSettings3D();
}

export function loadGameSettings3D() {
    const savedSettings = localStorage.getItem('gameSettings3D');
    if (savedSettings) {
        Object.assign(gameSettings, JSON.parse(savedSettings));
    }

    // Synchroniser les valeurs locales avec les paramètres chargés
    pointsToWinValue = gameSettings.winningScore;
    ballSizeValue = (gameSettings.ballSizeFactor / 0.015) * 3;
    paddleSizeValue = (gameSettings.paddleHeightFactor / 0.25) * 3;

    // Mise à jour des boutons radio pour la difficulté
    if (gameSettings.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    // Mise à jour des cases à cocher
    document.getElementById('resetPaddlePosition').checked = gameSettings.resetPaddlePosition;
    document.getElementById('setPowerUps').checked = gameSettings.setPowerUps;
    document.getElementById('setRally').checked = gameSettings.setRally;
}

export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) {
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = slider.value * multiplier;
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

export function updateUIWithGameSettings3D() {
    document.getElementById('pointsToWin').value = pointsToWinValue;
    document.getElementById('ballSize').value = ballSizeValue;
    document.getElementById('paddleSize').value = paddleSizeValue;

    if (gameSettings.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    if (gameSettings.is3D)
        document.getElementById('game3d').checked = true;
    else
        document.getElementById('game2d').checked = true;

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
            window.location.reload();
            isSettingsOpen = false;
        }
    });

    closeSettingsButton.addEventListener('click', () => {
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings3D();
        window.location.reload();
        isSettingsOpen = false;
    });

    updateScore();

    document.getElementById('resetSettings').addEventListener('click', () => {
        resetToDefaultSettings3D();
    });

    document.getElementById('ballSize').addEventListener('input', function (event) {
        ballSizeValue = Number(event.target.value);
        gameSettings.ballSizeFactor = 0.015 * (ballSizeValue / 3);
    
        // Apply 3D changes for the ball size
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
        }
    
        ball.geometry.dispose(); // Clear the previous geometry
        ball.geometry = newBallGeometry; // Set new geometry
    
        updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
        saveGameSettings3D();
    });
   

    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
        gameSettings.paddleHeightFactor = 0.25 * (paddleSizeValue / 3);

        // Apply 3D changes for the paddle size
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
        }

        paddleLeft.geometry.dispose();
        paddleRight.geometry.dispose();

        paddleLeft.geometry = newPaddleGeometry;
        paddleRight.geometry = newPaddleGeometry;

        updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
        saveGameSettings3D();
    });

    loadSettingsOnPageLoad3D();
    resetGame();
}

export function loadSettingsOnPageLoad3D() {
    loadGameSettings3D();
    updateUIWithGameSettings3D();
}
