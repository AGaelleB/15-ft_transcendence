// frontend/srcs/js/score3D.js

import { gameSettings2D } from '../gameSettings.js';
import { showWinMessage } from '../../Modals/winMsgModal.js';

export let player1Score2D = 0;
export let player2Score2D = 0;

export const setPlayer1Score2D = (value) => {
    player1Score2D = value;
    updateScore2D();
};

export const setPlayer2Score2D = (value) => {
    player2Score2D = value;
    updateScore2D();
};

export function updateScore2D() {
    const winningScore = gameSettings2D.winningScore;
    document.getElementById('player1Score2D').textContent = `${player1Score2D} / ${winningScore}`;
    document.getElementById('player2Score2D').textContent = `${player2Score2D} / ${winningScore}`;
}

export let gameOver = false;

export function isGameOver() {
    return gameOver;
}

export function checkGameEnd2D() {
    const winningScore = gameSettings2D.winningScore;
    
    if (player1Score2D >= winningScore) {
        gameOver = true;
        showWinMessage(1);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    else if (player2Score2D >= winningScore) {
        gameOver = true;
        showWinMessage(2);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    return false;
}
