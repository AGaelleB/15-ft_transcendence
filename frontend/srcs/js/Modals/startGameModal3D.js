// frontend/srcs/js/Modals/startGameModal2D.js

import { getIsSettingsOpen3D } from './gameSettingsModal3D.js';
import { setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';

let gameStarted3D = false;

function startGame3D(startGameMessage3D, settingsIcon, homeIcon) {
    startGameMessage3D.style.display = 'none';
    startGameMessage3D.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted3D = true;
}

export function resetGame3D() {
    gameStarted3D = false;
    setPlayer1Score3D(0);
    setPlayer2Score3D(0);
    updateScore3D();

    paddleLeft.position.set(-28, 0, 0);
    paddleRight.position.set(28, 0, 0);
    ball.position.set(0, 0, 0);
    gameSettings3D.ballSpeedZ3D = gameSettings3D.ballSpeedSAV;
    gameSettings3D.ballSpeedX3D = gameSettings3D.ballSpeedSAV;
}

export function handleKeyPress3D(e) {
    if (!gameStarted3D && !getIsSettingsOpen3D() && (e.code === 'Space' || e.code === 'Enter')) {
        startGame3D(startGameMessage3D, settingsIcon, homeIcon);
        document.removeEventListener('keypress', handleKeyPress3D);
    }
}

export function initializeGameStartListener3D(startGameMessage3D, settingsIcon, homeIcon) {
    document.addEventListener('keypress', handleKeyPress3D);
}

export function isGameStarted3D() {
    return gameStarted3D;
}