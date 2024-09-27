// frontend/srcs/js/Modals/winMsgModal.js

import { saveGameSettings } from './gameSettingsModal.js';

export function showWinMessage(winner) {
    const winnerMessage = document.querySelector('.message');
    winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
}


export function initializeWinMsg() {
    const homeButton = document.getElementById('homeButton');
    const againButton = document.getElementById('againButton');


    // Bouton "Home" redirige vers l'écran d'accueil
    homeButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    // Bouton "Play Again" redirige pour rejouer une partie
    againButton.addEventListener('click', function() {
        saveGameSettings();
    
        const gameMode = localStorage.getItem('gameMode');
    
        if (gameMode === '1 PLAYER')
            window.location.href = '1Player.html';
        else if (gameMode === '2 PLAYERS')
            window.location.href = '2Players.html';
        else if (gameMode === 'MULTI PLAYERS')
            window.location.href = 'multiPlayers.html';
        else
            console.error('Error: Mode de jeu non défini');
    });
}