// frontend/srcs/js/Modals/startGameModal2D.js

import { getIsSettingsOpen2D } from './gameSettingsModal2D.js';
import { setPlayer1Score2D, setPlayer2Score2D, updateScore2D } from '../PongGame/Game2D/score2D.js';

export let gameStarted2D = false;

function startGame2D(startGameMessage2D, settingsIcon, homeIcon) {
    startGameMessage2D.style.display = 'none';
    startGameMessage2D.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted2D = true;
}

export function resetGame2D() {
    gameStarted2D = false; 
    setPlayer1Score2D(0);
    setPlayer2Score2D(0);
    updateScore2D();
}

export function handleKeyPress2D(e) {
    if (!gameStarted2D && !getIsSettingsOpen2D() && (e.code === 'Space' || e.code === 'Enter')) {
        startGame2D(startGameMessage2D, settingsIcon, homeIcon);
        document.removeEventListener('keypress', handleKeyPress2D);
    }
}

export function initializeGameStartListener2D(startGameMessage2D, settingsIcon, homeIcon) {
    document.addEventListener('keypress', handleKeyPress2D);
}

export function isGameStarted2D() {
    return gameStarted2D;
}

export function setGameStarted2D(value) {
    if (typeof value === 'boolean')
        gameStarted2D = value;
    else
        console.warn("Invalid value. Please provide a boolean (true or false).");
}
