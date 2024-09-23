// buttonsSettings.js

import { gameSettings } from './gameSettings.js';

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

// Mettre à jour l'affichage des curseurs et des paramètres à l'ouverture de la page
function updateUIWithGameSettings() {
    // Ajustement des valeurs pour l'affichage du curseur de la vitesse de la balle
    document.getElementById('ballSpeed').value = gameSettings.ballSpeedX * 4;  // Multiplier par 4 pour l'affichage correct
    document.getElementById('paddleSpeed').value = gameSettings.paddleSpeedFactor * 200;  // Multiplier par 200 pour l'affichage correct
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
        settingsModal.style.display = 'flex';
        updateUIWithGameSettings();  // Mettre à jour l'interface utilisateur lorsque le modal est ouvert
    });

    // Ferme le modal des paramètres et sauvegarde les nouveaux paramètres
    closeSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        saveGameSettings();  // Sauvegarde les paramètres après fermeture du modal
    });

    // Bouton "Home" redirige vers l'écran d'accueil
    homeButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    // Bouton "Play Again" redirige pour rejouer une partie
    againButton.addEventListener('click', function() {
        saveGameSettings();  // Sauvegarde les paramètres avant de redémarrer
        window.location.href = '1Player.html';  // Recharge la page en utilisant les nouveaux paramètres
    });

    // Écoute les modifications des paramètres et met à jour gameSettings
    document.getElementById('ballSpeed').addEventListener('input', function (event) {
        const ballSpeed = Number(event.target.value);
        gameSettings.ballSpeedX = ballSpeed / 4;  // Reconvertir en interne (diviser par 4)
        gameSettings.ballSpeedY = ballSpeed / 4;  // Appliquer à la balle
    });

    document.getElementById('paddleSpeed').addEventListener('input', function (event) {
        const paddleSpeed = Number(event.target.value);
        gameSettings.paddleSpeedFactor = paddleSpeed / 200;  // Reconvertir en interne (diviser par 200)
    });

    document.getElementById('pointsToWin').addEventListener('input', function (event) {
        gameSettings.winningScore = Number(event.target.value);
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
    loadGameSettings();  // Charge les paramètres sauvegardés au chargement de la page
    updateUIWithGameSettings();  // Mettre à jour l'interface utilisateur avec les paramètres chargés
}

export function showWinMessage(winner) {
    const winnerMessage = document.querySelector('.message');
    winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
}

export function startGame(settingsIcon, startGameMessage) {
    startGameMessage.style.display = 'none';
    settingsIcon.classList.add('hidden');
    return true;
}

// Ajoute un écouteur d'événement pour démarrer le jeu
export function initializeGameStartListener(startGame) {
    let gameStarted = false;
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && (e.code === 'Space' || e.code === 'Enter')) {
            gameStarted = startGame();
        }
    });
}
