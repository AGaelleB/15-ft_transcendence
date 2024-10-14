// frontend/srcs/js/Modals/startGameModal2D.js

import { getIsSettingsOpen } from './gameSettingsModal3D.js';
import { setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';

let gameStarted = false;

function startGame(startGameMessage, settingsIcon, homeIcon) {
    // startGameMessage.style.display = 'none';
    startGameMessage.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted = true;
}

export function resetGame3D() {
    gameStarted = false; 
    setPlayer1Score3D(0);
    setPlayer2Score3D(0);
    updateScore3D();
}

export function initializeGameStartListener3D(startGameMessage, settingsIcon, homeIcon) {
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && !getIsSettingsOpen() && (e.code === 'Space' || e.code === 'Enter'))
            startGame(startGameMessage, settingsIcon, homeIcon);
    });
}

export function isGameStarted() {
    return gameStarted;
}