// frontend/srcs/js/Modals/winMsgModal.js

import { saveGameSettings } from './gameSettingsModal2D.js';
import { saveGameSettings3D } from './gameSettingsModal3D.js';

export function showWinMessage(winner) {
    // const winnerMessage = document.querySelector('.message');
    // winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

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
        // saveGameSettings3D();
    
        const gameMode = localStorage.getItem('gameMode');
    
        if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
            window.location.href = '1Player2D.html';
        else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
            window.location.href = '1Player3D.html';
        else if (gameMode === '2 PLAYERS' || gameMode === '2 joueurs' || gameMode === '2 jugadores')
            window.location.href = '2Players.html';
        else if (gameMode === 'MULTI PLAYERS' || gameMode === 'Multijoueur' || gameMode === 'multijugadores')
            window.location.href = 'multiPlayers.html';
        else
            console.error('Error: Mode de jeu non défini');
    });
}