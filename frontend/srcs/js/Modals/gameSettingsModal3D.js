// frontend/srcs/js/Modals/gameSettingsModal3D.js

import { gameSettings3D } from '../PongGame/gameSettings.js';
import { updateScore3D } from '../PongGame/Game3D/score3D.js';
import { resetGame3D } from './startGameModal3D.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';
import { animationId3D1P } from '../Screens/1Player3D.js';
import { animationId3D2P } from '../Screens/2Players3D.js';
import { isTournament3D } from '../Screens/multiPlayers3D.js';

let isSettingsOpen3D = false;
let ballSpeedValue = 3;
let paddleSpeedValue = 3;
let ballSizeValue = 3;
let paddleSizeValue = 3;
let pointsToWinValue = 5;

export function getIsSettingsOpen3D() {
    return isSettingsOpen3D;
}

export function saveGameSettings3D() {
    localStorage.setItem('gameSettings3D', JSON.stringify(gameSettings3D));
}

export function loadSettingsStorage3D() {
    const savedSettings = localStorage.getItem('gameSettings3D');
    if (savedSettings) {
        Object.assign(gameSettings3D, JSON.parse(savedSettings));
        // console.log('Loaded game settings:', gameSettings3D);
    }
}

function resetToDefaultSettings3D() {
    gameSettings3D.ballSpeedSAV = 0.30;
    gameSettings3D.ballSpeedX3D = 0.30;
    gameSettings3D.ballSpeedZ3D = 0.30;
    gameSettings3D.paddleSpeed3D = 0.3;
    gameSettings3D.ballRadius3D = 0.75;
    gameSettings3D.paddleWidth3D = 1;
    gameSettings3D.paddleHeight3D = 1.5;
    gameSettings3D.paddleDepth3D = 5;
    gameSettings3D.winningScore = 5;
    gameSettings3D.difficultyLevel3D = "intermediate";
    gameSettings3D.resetPaddlePosition = false;
    gameSettings3D.setRally3D = false;
    gameSettings3D.setPowerUps3D = false;

    ballSpeedValue = 3;
    paddleSpeedValue = 3;
    ballSizeValue = 3;
    paddleSizeValue = 3;
    pointsToWinValue = 5;

    saveGameSettings3D();
    loadSettingsStorage3D();
    updateSettingsModal3D();
}

export function updateSliderValuePosition(sliderId, spanId, multiplier, offset) {
    const slider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(spanId);
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    sliderValue.textContent = slider.value * multiplier;
    sliderValue.style.left = `calc(${value}% + (${offset - value * 0.3}px))`;
}

export function updateSettingsModal3D() {
    if (gameSettings3D.ballSpeedSAV <= 0.10) ballSpeedValue = 1;
    else if (gameSettings3D.ballSpeedSAV <= 0.20) ballSpeedValue = 2;
    else if (gameSettings3D.ballSpeedSAV <= 0.30) ballSpeedValue = 3;
    else if (gameSettings3D.ballSpeedSAV <= 0.40) ballSpeedValue = 4;
    else ballSpeedValue = 5;

    if (gameSettings3D.paddleSpeed3D <= 0.1) paddleSpeedValue = 1;
    else if (gameSettings3D.paddleSpeed3D <= 0.2) paddleSpeedValue = 2;
    else if (gameSettings3D.paddleSpeed3D <= 0.3) paddleSpeedValue = 3;
    else if (gameSettings3D.paddleSpeed3D <= 0.4) paddleSpeedValue = 4;
    else paddleSpeedValue = 5;

    if (gameSettings3D.ballRadius3D <= 0.25) ballSizeValue = 1;
    else if (gameSettings3D.ballRadius3D <= 0.5) ballSizeValue = 2;
    else if (gameSettings3D.ballRadius3D <= 0.75) ballSizeValue = 3;
    else if (gameSettings3D.ballRadius3D <= 1.2) ballSizeValue = 4;
    else ballSizeValue = 5;

    if (gameSettings3D.paddleDepth3D <= 2) paddleSizeValue = 1;
    else if (gameSettings3D.paddleDepth3D <= 3.5) paddleSizeValue = 2;
    else if (gameSettings3D.paddleDepth3D <= 5) paddleSizeValue = 3;
    else if (gameSettings3D.paddleDepth3D <= 7.5) paddleSizeValue = 4;
    else paddleSizeValue = 5;

    pointsToWinValue = gameSettings3D.winningScore;

    if (gameSettings3D.difficultyLevel3D === "novice")
        document.getElementById('novice').checked = true;
    else if (gameSettings3D.difficultyLevel3D === "intermediate")
        document.getElementById('intermediate').checked = true;
    else if (gameSettings3D.difficultyLevel3D === "expert")
        document.getElementById('expert').checked = true;

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
    document.getElementById('resetPaddlePosition').checked = gameSettings3D.resetPaddlePosition;
    document.getElementById('setPowerUps').checked = gameSettings3D.setPowerUps3D;
    document.getElementById('setRally').checked = gameSettings3D.setRally3D;
}

// export function initializeGameSettings3D() {
//     const settingsIcon = document.getElementById('settingsIcon');
//     const settingsModal = document.getElementById('settingsModal');
//     const closeSettingsButton = document.getElementById('closeSettings');

//     settingsModal.style.display = 'none';

//     settingsIcon.addEventListener('click', () => {
//         if (!isSettingsOpen3D) {
//             document.querySelector('.settings-modal-container').classList.add('active');
//             settingsModal.style.display = 'flex';
//             updateSettingsModal3D();
//             isSettingsOpen3D = true;
//         }
//         else {
//             cancelAnimationFrame(animationId3D1P);
//             cancelAnimationFrame(animationId3D2P);
//             document.querySelector('.settings-modal-container').classList.remove('active');
//             settingsModal.style.display = 'none';
//             saveGameSettings3D();
//             isSettingsOpen3D = false;
//             const gameMode = localStorage.getItem('gameMode');
//             let targetPath = '/home';
//             if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
//                 targetPath = '/1player-2d';
//             else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
//                 targetPath = '/1player-3d';
//             else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
//                 targetPath = '/2players-2d';
//             else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
//                 targetPath = '/2players-3d';
//             else if (gameMode === 'MULTI PLAYERS 2D' || gameMode === 'Multijoueur 2D' || gameMode === 'multijugadores 2D')
//                 targetPath = '/multi-2d';
//             else if (gameMode === 'MULTI PLAYERS 3D' || gameMode === 'Multijoueur 3D' || gameMode === 'multijugadores 3D')
//                 targetPath = '/multi-3d';
//             else
//                 console.error('Error: Mode de jeu non défini');

//             window.history.pushState({}, "", targetPath);
//             handleLocation();
//         }
//     });

//     closeSettingsButton.addEventListener('click', () => {
//         cancelAnimationFrame(animationId3D1P);
//         cancelAnimationFrame(animationId3D2P);
//         document.querySelector('.settings-modal-container').classList.remove('active');
//         settingsModal.style.display = 'none';
//         saveGameSettings3D();
//         isSettingsOpen3D = false;
//         const gameMode = localStorage.getItem('gameMode');
//         let targetPath = '/home';
//         if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
//             targetPath = '/1player-2d';
//         else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
//             targetPath = '/1player-3d';
//         else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
//             targetPath = '/2players-2d';
//         else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
//             targetPath = '/2players-3d';
//         else if (gameMode === 'MULTI PLAYERS 2D' || gameMode === 'Multijoueur 2D' || gameMode === 'multijugadores 2D')
//             targetPath = '/multi-2d';
//         else if (gameMode === 'MULTI PLAYERS 3D' || gameMode === 'Multijoueur 3D' || gameMode === 'multijugadores 3D')
//             targetPath = '/multi-3d';
//         else
//             console.error('Error: Mode de jeu non défini');

//         window.history.pushState({}, "", targetPath);
//         handleLocation();
//     });

export function initializeGameSettings3D() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';

    function closeSettingsModal3D() {
        cancelAnimationFrame(animationId3D1P);
        cancelAnimationFrame(animationId3D2P);
        document.querySelector('.settings-modal-container').classList.remove('active');
        settingsModal.style.display = 'none';
        saveGameSettings3D();
        loadGameSettings3D();  // Charger les paramètres sauvegardés
        isSettingsOpen3D = false;

        // Définir le chemin de redirection basé sur le mode de jeu
        let targetPath = '/home';
        const gameMode = localStorage.getItem('gameMode');

        if (isTournament3D) {
            targetPath = window.location.pathname;
        } else if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D') {
            targetPath = '/1player-2d';
        } else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D') {
            targetPath = '/1player-3d';
        } else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D') {
            targetPath = '/2players-2d';
        } else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D') {
            targetPath = '/2players-3d';
        } else if (gameMode === 'MULTI PLAYERS 2D' || gameMode === 'Multijoueur 2D' || gameMode === 'multijugadores 2D') {
            targetPath = '/multi-2d';
        } else if (gameMode === 'MULTI PLAYERS 3D' || gameMode === 'Multijoueur 3D' || gameMode === 'multijugadores 3D') {
            targetPath = '/multi-3d';
        } else {
            console.error('Error: Mode de jeu non défini');
        }

        // Rediriger vers la bonne page
        window.history.pushState({}, "", targetPath);
        handleLocation();
    }

    // Ouvrir et fermer le modal de paramètres en 3D
    settingsIcon.addEventListener('click', () => {
        if (!isSettingsOpen3D) {
            document.querySelector('.settings-modal-container').classList.add('active');
            settingsModal.style.display = 'flex';
            updateSettingsModal3D();  // Mettre à jour les paramètres de la modale
            isSettingsOpen3D = true;
        } else {
            closeSettingsModal3D();
        }
    });

    // Fermer le modal de paramètres en cliquant sur le bouton de fermeture
    closeSettingsButton.addEventListener('click', closeSettingsModal3D);

    // Empêcher les événements de propagation dans le modal
    settingsModal.addEventListener('keydown', (e) => {
        if (isSettingsOpen3D && (e.code === 'Space' || e.code === 'Enter')) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

    updateScore3D();

    
    document.getElementById('resetSettings').addEventListener('click', () => {
        resetToDefaultSettings3D();
        updateScore3D();
    });
    
    document.getElementById('novice').addEventListener('change', function () {
        if (this.checked) {
            gameSettings3D.difficultyLevel3D = "novice"; 
            gameSettings3D.errorMargin3D = 3 + (Math.random() * 2);
            saveGameSettings3D();
        }
    });
    
    document.getElementById('intermediate').addEventListener('change', function () {
        if (this.checked) {
            gameSettings3D.difficultyLevel3D = "intermediate"; 
            gameSettings3D.errorMargin3D = 2 + (Math.random() * 1);
            saveGameSettings3D();
        }
    });
    
    document.getElementById('expert').addEventListener('change', function () {
        if (this.checked) {
            gameSettings3D.difficultyLevel3D = "expert"; 
            gameSettings3D.errorMargin3D = 1 + (Math.random() * 0.5);
            saveGameSettings3D();
        }
    });

    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);

        switch (ballSpeed) {
            case 1:
                gameSettings3D.ballSpeedX3D = 0.10;
                gameSettings3D.ballSpeedZ3D = 0.10;
                gameSettings3D.ballSpeedSAV = 0.10;
                break;
            case 2:
                gameSettings3D.ballSpeedX3D = 0.20;
                gameSettings3D.ballSpeedZ3D = 0.20;
                gameSettings3D.ballSpeedSAV = 0.20;
                break;
            case 3:
                gameSettings3D.ballSpeedX3D = 0.30;
                gameSettings3D.ballSpeedZ3D = 0.30;
                gameSettings3D.ballSpeedSAV = 0.30;
                break;
            case 4:
                gameSettings3D.ballSpeedX3D = 0.40;
                gameSettings3D.ballSpeedZ3D = 0.40;
                gameSettings3D.ballSpeedSAV = 0.40;
                break;
            case 5:
                gameSettings3D.ballSpeedX3D = 0.55;
                gameSettings3D.ballSpeedZ3D = 0.55;
                gameSettings3D.ballSpeedSAV = 0.55;
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
        
        paddleLeft.geometry.dispose();
        paddleRight.geometry.dispose();
        
        const newPaddleGeometry = new THREE.BoxGeometry(gameSettings3D.paddleWidth3D, gameSettings3D.paddleHeight3D, gameSettings3D.paddleDepth3D);
        paddleLeft.geometry = newPaddleGeometry;
        paddleRight.geometry = newPaddleGeometry;
        
        updateSliderValuePosition('paddleSize', 'paddleSizeValue', 1, 16);
        saveGameSettings3D();
    });

    loadSettingsOnPageLoad3D();
    resetGame3D();

    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        pointsToWinValue = Number(event.target.value);
        gameSettings3D.winningScore = pointsToWinValue;
        updateSliderValuePosition('pointsToWin', 'pointsToWinValue', 1, 16);
        updateScore3D();
        saveGameSettings3D();
    });

    document.getElementById('resetPaddlePosition').addEventListener('change', function (event) {
        gameSettings3D.resetPaddlePosition = event.target.checked;
        saveGameSettings3D();
    });

    document.getElementById('setPowerUps').addEventListener('change', function (event) {
        gameSettings3D.setPowerUps3D = event.target.checked;
        saveGameSettings3D();
    });

    document.getElementById('setRally').addEventListener('change', function (event) {
        gameSettings3D.setRally3D = event.target.checked;
        saveGameSettings3D();
    });

    loadSettingsOnPageLoad3D();
    resetGame3D();
}

export function loadSettingsOnPageLoad3D() {
    updateSettingsModal3D();
}
