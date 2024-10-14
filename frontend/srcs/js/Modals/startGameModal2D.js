// frontend/srcs/js/Modals/startGameModal2D.js

import { getIsSettingsOpen } from './gameSettingsModal2D.js';
import { setPlayer1Score2D, setPlayer2Score2D, updateScore2D } from '../PongGame/Game2D/score2D.js';

let gameStarted = false;

function startGame(startGameMessage, settingsIcon, homeIcon) {
    startGameMessage.style.display = 'none';
    startGameMessage.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted = true;
}

export function resetGame2D() {
    gameStarted = false; 
    setPlayer1Score2D(0);
    setPlayer2Score2D(0);
    updateScore2D();
}

export function initializeGameStartListener2D(startGameMessage, settingsIcon, homeIcon) {
    function handleKeyPress(e) {
        if (!gameStarted && !getIsSettingsOpen() && (e.code === 'Space' || e.code === 'Enter')) {
            startGame(startGameMessage, settingsIcon, homeIcon);
            document.removeEventListener('keypress', handleKeyPress);
        }
    }
    document.addEventListener('keypress', handleKeyPress);
}

export function isGameStarted() {
    return gameStarted;
}