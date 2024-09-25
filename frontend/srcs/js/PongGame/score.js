// frontend/srcs/js/score.js

import { gameSettings } from './gameSettings.js';
import { showWinMessage } from '../Modals/settingsModal.js';

export let player1Score = 0;
export let player2Score = 0;

export const setPlayer1Score = (value) => {
    player1Score = value;
    updateScore();
};

export const setPlayer2Score = (value) => {
    player2Score = value;
    updateScore();
};

export function updateScore() {
    const winningScore = gameSettings.winningScore;
    document.getElementById('player1Score').textContent = `${player1Score} / ${winningScore}`;
    document.getElementById('player2Score').textContent = `${player2Score} / ${winningScore}`;
}

export let gameOver = false;

export function isGameOver() {
    return gameOver;
}

export function checkGameEnd() {
    const winningScore = gameSettings.winningScore;
    
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