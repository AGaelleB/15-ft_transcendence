// frontend/srcs/js/Modals/gameSettingsModal2D.js

import { gameSettings2D } from '../PongGame/gameSettings.js';
import { updateScore2D } from '../PongGame/Game2D/score2D.js';
import { resetGame2D } from './startGameModal2D.js';
import { animationId2D1P } from '../Screens/1Player2D.js';
import { animationId2D2P } from '../Screens/2Players2D.js';
import { isTournament2D } from '../Screens/tournament2D.js';

let isSettingsOpen2D = false;
let ballSizeValue = 3;
let paddleSizeValue = 3;
let pointsToWinValue = 0;

export function getIsSettingsOpen2D() {
    return isSettingsOpen2D;
}

export function saveGameSettings2D() {
    localStorage.setItem('gameSettings2D', JSON.stringify(gameSettings2D));
}

const defaultGameSettings = {
    difficultyLevel: "intermediate",
    ballSpeedX2D: 1.25,
    ballSpeedY2D: 1.25,
    paddleSpeedFactor: 0.035,
    ballSizeFactor2D: 0.015,
    paddleHeight2D: 0.25,
    winningScore: 5,
    resetPaddlePosition: false,
    setPowerUps: false,
    setRally: false,
};

function resetToDefaultSettings() {
    Object.assign(gameSettings2D, defaultGameSettings);
    saveGameSettings2D();
    loadGameSettings2D();
    updateSettingsModal2D();
}

function loadGameSettings2D() {
    const savedSettings = localStorage.getItem('gameSettings2D');
    if (savedSettings)
        Object.assign(gameSettings2D, JSON.parse(savedSettings));

    pointsToWinValue = gameSettings2D.winningScore;
    ballSizeValue = (gameSettings2D.ballSizeFactor2D / 0.015) * 3;
    paddleSizeValue = (gameSettings2D.paddleHeight2D / 0.25) * 3;

    if (gameSettings2D.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings2D.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings2D.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    document.getElementById('resetPaddlePosition').checked = gameSettings2D.resetPaddlePosition;
    document.getElementById('setPowerUps').checked = gameSettings2D.setPowerUps;
    document.getElementById('setRally').checked = gameSettings2D.setRally;
}

export function updateSliderValuePositionSpeed(sliderId, spanId, multiplier, offset) { 
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = (slider.value * multiplier) - 2;
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
            return 0.035;
    }
}

function reverseMapPaddleSpeed(paddleSpeedFactor) {
    if (paddleSpeedFactor === 0.015) 
        return 1;
    else if (paddleSpeedFactor === 0.025) 
        return 2;
    else if (paddleSpeedFactor === 0.035) 
        return 3;
    else if (paddleSpeedFactor === 0.045) 
        return 4;
    else if (paddleSpeedFactor === 0.055) 
        return 5;
    else 
        return 3;
}

export function updateSettingsModal2D() {
    document.getElementById('ballSpeed').value = gameSettings2D.ballSpeedX2D * 4;
    document.getElementById('paddleSpeed').value = reverseMapPaddleSpeed(gameSettings2D.paddleSpeedFactor);
    document.getElementById('pointsToWin').value = pointsToWinValue;
    document.getElementById('ballSize').value = ballSizeValue;
    document.getElementById('paddleSize').value = paddleSizeValue;

    if (gameSettings2D.difficultyLevel === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings2D.difficultyLevel === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings2D.difficultyLevel === "expert")
        document.getElementById('expert').checked = true;

    updateSliderValuePositionSpeed('ballSpeed', 'ballSpeedValue', 1, 16);
    updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
    updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
    updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
    updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
}

export function initializeGameSettings2D() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    function closeSettingsModal() {
        cancelAnimationFrame(animationId2D1P);
        cancelAnimationFrame(animationId2D2P);
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings2D();
        loadGameSettings2D();
        isSettingsOpen2D = false;

        let targetPath = '/home';
        const gameMode = localStorage.getItem('gameMode');

        if (isTournament2D)
            targetPath = window.location.pathname;
        else if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
            targetPath = '/1player-2d';
        else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
            targetPath = '/1player-3d';
        else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
            targetPath = '/2players-2d';
        else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
            targetPath = '/2players-3d';
        else if (gameMode === 'TOURNAMENT 2D' || gameMode === 'tournoi 2D' || gameMode === 'Torneo 2D')
            targetPath = '/tournament-2d';
        else if (gameMode === 'TOURNAMENT 3D' || gameMode === 'tournoi 3D' || gameMode === 'Torneo 3D')
            targetPath = '/tournament-3d';
        else
            console.error('Error: Mode de jeu non défini');

        window.history.pushState({}, "", targetPath);
        handleLocation();
    }

    settingsIcon.addEventListener('click', () => {
        if (!isSettingsOpen2D) {
            document.querySelector('.settings-modal-container').classList.add('active');
            settingsModal.style.display = 'flex';
            updateSettingsModal2D();
            isSettingsOpen2D = true;
        }
        else
            closeSettingsModal();
    });

    closeSettingsButton.addEventListener('click', closeSettingsModal);

    settingsModal.addEventListener('keydown', (e) => {
        if (isSettingsOpen2D && (e.code === 'Space' || e.code === 'Enter')) {
            e.stopPropagation();
            e.preventDefault();
        }
    }); 

    updateScore2D();

    document.getElementById('resetSettings').addEventListener('click', () => {
        resetToDefaultSettings();
        updateScore2D();
    });
    
    document.getElementById('novice').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "novice"; 
            gameSettings2D.errorMargin = Math.random() * 200 - 100;
            saveGameSettings2D();
        }
    });
    
    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "intermediate"; 
            gameSettings2D.errorMargin = Math.random() * 150 - 75;
            saveGameSettings2D();
        }
    });
    
    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings2D.difficultyLevel = "expert"; 
            gameSettings2D.errorMargin = Math.random() * 50 - 25;
            saveGameSettings2D();
        }
    });    

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);
        gameSettings2D.ballSpeedX2D = ballSpeed / 4;
        gameSettings2D.ballSpeedY2D = ballSpeed / 4;
        updateSliderValuePositionSpeed('ballSpeed', 'ballSpeedValue', 1, 16);
        saveGameSettings2D();
    });
    
    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        gameSettings2D.paddleSpeedFactor = mapPaddleSpeed(paddleSpeed);
        updateSliderValuePosition('paddleSpeed', 'paddleSpeedValue', 1, 16);
        saveGameSettings2D();
    });

    document.getElementById('ballSize').addEventListener('input', function (event) {
        ballSizeValue = Number(event.target.value);
        gameSettings2D.ballSizeFactor2D = 0.015 * (ballSizeValue / 3); 
        updateSliderValuePosition('ballSize', 'ballSizeValue', 1, 16);
        saveGameSettings2D();
    });
    
    document.getElementById('paddleSize').addEventListener('input', function (event) {
        paddleSizeValue = Number(event.target.value);
        gameSettings2D.paddleHeight2D = 0.25 * (paddleSizeValue / 3); 
        updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
        saveGameSettings2D();
    });
    
    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        pointsToWinValue = Number(event.target.value);
        gameSettings2D.winningScore = pointsToWinValue;
        updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
        updateScore2D();
        saveGameSettings2D();
    });

    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings2D.resetPaddlePosition = event.target.checked;
        saveGameSettings2D();
    });
    
    document.getElementById('setPowerUps').addEventListener('change', function (event) {
        gameSettings2D.setPowerUps = event.target.checked;
        saveGameSettings2D();
    });
    
    document.getElementById('setRally').addEventListener('change', function (event) {
        gameSettings2D.setRally = event.target.checked;
        saveGameSettings2D();
    });

    loadSettingsOnPageLoad2D();
    resetGame2D();
}

export function loadSettingsOnPageLoad2D() {
    loadGameSettings2D();
    updateSettingsModal2D();
}
