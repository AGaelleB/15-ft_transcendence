// frontend/srcs/js/PongGame/Game3D/score3D.js

import { gameSettings3D } from '../gameSettings.js';
import { showWinMessage } from '../../Modals/winMsgModal.js';

export let player1Score = 0;
export let player2Score = 0;

export const setPlayer1Score3D = (value) => {
    player1Score = value;
    updateScore3D();
};

export const setPlayer2Score3D = (value) => {
    player2Score = value;
    updateScore3D();
};

export function updateScore3D() {
    const winningScore = gameSettings3D.winningScore;
    document.getElementById('player1Score').textContent = `${player1Score} / ${winningScore}`;
    document.getElementById('player2Score').textContent = `${player2Score} / ${winningScore}`;
}

export let gameOver = false;

export function isGameOver3D() {
    return gameOver;
}

export function checkGameEnd() {
    const winningScore = gameSettings3D.winningScore;
    
    if (player1Score >= winningScore) {
        gameOver = true;
        showWinMessage(1);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    else if (player2Score >= winningScore) {
        gameOver = true;
        showWinMessage(2);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    return false;
}
