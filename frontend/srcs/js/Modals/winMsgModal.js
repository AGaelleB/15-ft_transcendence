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
        else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
            window.location.href = '2Players2D.html';
        else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
            window.location.href = '2Players3D.html';
        else if (gameMode === 'MULTI PLAYERS 2D' || gameMode === 'Multijoueur 2D' || gameMode === 'multijugadores 2D')
            window.location.href = 'multiPlayers2D.html';
        else if (gameMode === 'MULTI PLAYERS 3D' || gameMode === 'Multijoueur 3D' || gameMode === 'multijugadores 3D')
            window.location.href = 'multiPlayers3D.html';
        else
            console.error('Error: Mode de jeu non défini');
    });
}