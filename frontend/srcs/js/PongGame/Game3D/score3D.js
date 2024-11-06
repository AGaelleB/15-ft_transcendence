// frontend/srcs/js/PongGame/Game3D/score3D.js

import { gameSettings3D } from '../gameSettings.js';
import { currentMatchPlayers3D, isTournament3D, showWinMessageTournament3D } from '../../Screens/multiPlayers3D.js';
import { isTwoPlayerMode3D, showWinMessage } from '../../Modals/winMsgModal.js';

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

    // Determine player names based on game context
    let player1Name;
    let player2Name;

    if (isTournament3D) {
        player1Name = currentMatchPlayers3D.player1;
        player2Name = currentMatchPlayers3D.player2;
    }
    else {
        player1Name = getUserFromStorage3D();
        if (isTwoPlayerMode3D)
            player2Name = "Player 2";
        else
            player2Name = "Mr Robot";
    }

    document.getElementById('player1Score3D').textContent = `${player1Score3D} / ${winningScore}`;
    document.getElementById('player2Score3D').textContent = `${player2Score3D} / ${winningScore}`;

    document.querySelector('.score-container.left .username').textContent = player1Name;
    document.querySelector('.score-container.right .username').textContent = player2Name;

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

export function getUserFromStorage3D() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.username ? userData.username : "Player 1";
}

export function checkGameEnd3D() {
    const winningScore = gameSettings3D.winningScore;

    let player1Name;
    let player2Name;

    if (isTournament3D) {
        player1Name = currentMatchPlayers3D.player1;
        player2Name = currentMatchPlayers3D.player2;
    }
    else {
        player1Name = getUserFromStorage3D();
        if (isTwoPlayerMode3D)
            player2Name = "Player 2";
        else
            player2Name = "Mr Robot";
    }

    if (player1Score3D >= winningScore) {
        gameOver3D = true;
        if (isTournament3D)
            showWinMessageTournament3D(player1Name);
        else
            showWinMessage("player", player1Name);
        return true;
    } 
    else if (player2Score3D >= winningScore) {
        gameOver3D = true;
        if (isTournament3D)
            showWinMessageTournament3D(player2Name);
        else
            showWinMessage("2", player2Name);
        return true;
    }
    return false;
}
