// frontend/srcs/js/PongGame/Game3D/score3D.js

import { gameSettings3D } from '../gameSettings.js';
import { showWinMessage } from '../../Modals/winMsgModal.js';

export let player1Score3D = 0;
export let player2Score3D = 0;

export const setPlayer1Score3D = (value) => {
    player1Score3D = value;
    updateScore3D();
};

export const setPlayer2Score3D = (value) => {
    player2Score3D = value;
    updateScore3D();
};

export function updateScore3D() {
    const winningScore = gameSettings3D.winningScore;
    document.getElementById('player1Score3D').textContent = `${player1Score3D} / ${winningScore}`;
    document.getElementById('player2Score3D').textContent = `${player2Score3D} / ${winningScore}`;
}

let gameOver3D = false;

export function isGameOver3D() {
    return gameOver3D;
}

export function setIsGameOver3D(value) {
    if (typeof value === 'boolean')
        gameOver3D = value;
    else
        console.warn("Invalid value. Please provide a boolean (true or false).");
}

export function checkGameEnd3D() {
    const winningScore = gameSettings3D.winningScore;

    let username = "Player";
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.username)
            username = user.username;
    }

    // if player 1 wins
    if (player1Score3D >= winningScore) {
        gameOver3D = true;
        showWinMessage("player", username);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    } 
    // if the AI wins
    else if (player2Score3D >= winningScore) {
        gameOver3D = true;
        const opponentName = "Mr Robot";
        showWinMessage("2", opponentName);
        document.getElementById('settingsIcon').classList.remove('hidden');
        return true;
    }
    return false;
}
