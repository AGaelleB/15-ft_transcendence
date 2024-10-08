// frontend/srcs/js/Modals/gameSettingsModal2D.js

import { gameSettings2D } from '../PongGame/gameSettings.js';
import { updateScore } from '../PongGame/Game2D/score2D.js';
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
    localStorage.setItem('gameSettings2D', JSON.stringify(gameSettings2D));
}

// Default game settings for reset
const defaultGameSettings = {
    is3D: false,
    difficultyLevel: "intermediate",
    ballSpeedX2D: 1.25,
    ballSpeedY2D: 1.25,
    paddleSpeedFactor: 0.035,
    ballSizeFactor2D: 0.015,
    paddleHeight2D: 0.25,
    winningScore: 5,
    resetPaddlePosition: true,
    setPowerUps: false,
    setRally: false,
};

function resetToDefaultSettings() {
    Object.assign(gameSettings2D, defaultGameSettings);
    saveGameSettings();

    loadGameSettings();
    updateUIWithGameSettings();
}

export function loadGameSettings() {
    const savedSettings = localStorage.getItem('gameSettings2D');
    if (savedSettings)
        Object.assign(gameSettings2D, JSON.parse(savedSettings));

    // Synchroniser les valeurs locales avec les paramètres chargés
    pointsToWinValue = gameSettings2D.winningScore;
    ballSizeValue = (gameSettings2D.ballSizeFactor2D / 0.015) * 3;
    paddleSizeValue = (gameSettings2D.paddleHeight2D / 0.25) * 3;

    // Mettre à jour les boutons radio pour la difficulté
    if (gameSettings2D.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings2D.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings2D.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    // Mettre à jour la case à cocher pour resetPaddlePosition, setPowerUps
    document.getElementById('resetPaddlePosition').checked = gameSettings2D.resetPaddlePosition;
    document.getElementById('setPowerUps').checked = gameSettings2D.setPowerUps;
    document.getElementById('setRally').checked = gameSettings2D.setRally;
}

export function updateSliderValuePositionSpeed(sliderId, spanId, multiplier, offset) { 
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = (slider.value * multiplier) - 2; // Affichage de la valeur décalée
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) { 
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = (slider.value * multiplier);
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

function mapPaddleSpeed(paddleSpeed) {
    // Attribuer directement les valeurs de vitesse à chaque cran
    switch (paddleSpeed) {
        case 1:
            return 0.015;
        case 2:
            return 0.025;
        case 3:
            return 0.035;
        case 4:
            return 0.045;
        case 5:
            return 0.055;
        default:
            return 0.035; // Valeur par défaut au cas où
    }
}

function reverseMapPaddleSpeed(paddleSpeedFactor) {
    if (paddleSpeedFactor === 0.015) return 1;
    else if (paddleSpeedFactor === 0.025) return 2;
    else if (paddleSpeedFactor === 0.035) return 3;
    else if (paddleSpeedFactor === 0.045) return 4;
    else if (paddleSpeedFactor === 0.055) return 5;
    else return 3; // Valeur par défaut si rien ne correspond
}

export function updateUIWithGameSettings() {
    // Met à jour les sliders avec les valeurs récupérées
    document.getElementById('ballSpeed').value = gameSettings2D.ballSpeedX2D * 4;

    // Utilise la fonction inversée pour récupérer la position du slider
    document.getElementById('paddleSpeed').value = reverseMapPaddleSpeed(gameSettings2D.paddleSpeedFactor);
    
    document.getElementById('pointsToWin').value = pointsToWinValue;
    document.getElementById('ballSize').value = ballSizeValue;
    document.getElementById('paddleSize').value = paddleSizeValue;

    // Mise à jour de la difficulté du bot
    if (gameSettings2D.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings2D.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings2D.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    // Mettre à jour l'affichage des valeurs des sliders
    updateSliderValuePositionSpeed('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
    updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
    updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
    updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
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

    document.getElementById('resetSettings').addEventListener('click', () => {
        resetToDefaultSettings();
    });
    
    document.getElementById('novice').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "novice"; 
            gameSettings2D.errorMargin = Math.random() * 200 - 100;
            saveGameSettings();
        }
    });
    
    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "intermediate"; 
            gameSettings2D.errorMargin = Math.random() * 150 - 75;
            saveGameSettings();
        }
    });
    
    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "expert"; 
            gameSettings2D.errorMargin = Math.random() * 50 - 25;
            saveGameSettings();
        }
    });    

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);
        gameSettings2D.ballSpeedX2D = ballSpeed / 4;
        gameSettings2D.ballSpeedY2D = ballSpeed / 4;
        updateSliderValuePositionSpeed('ballSpeed', 'ballSpeedValue', 1, 16);
        saveGameSettings();
    });
    
    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        
        // Utiliser la fonction de mappage simple
        gameSettings2D.paddleSpeedFactor = mapPaddleSpeed(paddleSpeed);
        
        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
        saveGameSettings();
    });
    

    document.getElementById('ballSize').addEventListener('input', function (event) {
        ballSizeValue = Number(event.target.value);
        gameSettings2D.ballSizeFactor2D = 0.015 * (ballSizeValue / 3); 
        updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
        saveGameSettings();
    });
    
    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
        gameSettings2D.paddleHeight2D = 0.25 * (paddleSizeValue / 3); 
        updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
        saveGameSettings();
    });
    
    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        pointsToWinValue = Number(event.target.value);
        gameSettings2D.winningScore = pointsToWinValue;
        updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
        updateScore();
        saveGameSettings();
    });

    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings2D.resetPaddlePosition = event.target.checked;
        saveGameSettings();
    });
    
    document.getElementById('setPowerUps').addEventListener('change', function (event) {
        gameSettings2D.setPowerUps = event.target.checked;
        saveGameSettings();
    });
    
    document.getElementById('setRally').addEventListener('change', function (event) {
        gameSettings2D.setRally = event.target.checked;
        saveGameSettings();
    });

    loadSettingsOnPageLoad();
    console.log("Settings after load:", gameSettings2D);
    resetGame();
}

// Charger les paramètres lors de l'initialisation de la page
export function loadSettingsOnPageLoad() {
    loadGameSettings();
    updateUIWithGameSettings();
}