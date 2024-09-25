// frontend/srcs/js/Modals/startGameModal.js

import { getIsSettingsOpen } from './gameSettingsModal.js';

let gameStarted = false; // Variable globale pour le statut du jeu

// Fonction pour démarrer le jeu
export function startGame(startGameMessage, settingsIcon) {
    startGameMessage.style.display = 'none';
    settingsIcon.classList.add('hidden');
    gameStarted = true; // Mettre à jour l'état global
}

// Réinitialiser l'état du jeu si nécessaire
export function resetGame() {
    gameStarted = false; 
    setPlayer1Score(0);
    setPlayer2Score(0);
    updateScore();
}

// Fonction pour ajouter l'écouteur de démarrage du jeu avec les touches
export function initializeGameStartListener(startGameMessage, settingsIcon) {
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && !getIsSettingsOpen() && (e.code === 'Space' || e.code === 'Enter'))
            startGame(startGameMessage, settingsIcon);
    });
}

export function isGameStarted() {
    return gameStarted;
}