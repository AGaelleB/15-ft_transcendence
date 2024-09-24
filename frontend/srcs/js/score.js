// frontend/srcs/js/score.js

import { gameSettings } from './gameSettings.js';
import { showWinMessage } from './buttonsSettings.js';

// export let player1Score = 0;
// export let player2Score = 0;

// export const setPlayer1Score = (value) => {
//     player1Score = value;
//     updateScore();
// };

// export const setPlayer2Score = (value) => {
//     player2Score = value;
//     updateScore();
// };

// function updateScore() {
//     const winningScore = gameSettings.winningScore;
    
//     // Correctly set the text content of the player score elements
//     document.getElementById('player1Score').textContent = player1Score + ' / ' + winningScore;
//     document.getElementById('player2Score').textContent = player2Score + ' / ' + winningScore;
// }

export function checkGameEnd(player1Score, player2Score) {
    const winningScore = gameSettings.winningScore;
    
    if (player1Score >= winningScore) {
        showWinMessage(1);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    else if (player2Score >= winningScore) {
        showWinMessage(2);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    return false;
}

// export function resetScores() {
//     player1Score = 0;
//     player2Score = 0;
//     updateScore();
// }