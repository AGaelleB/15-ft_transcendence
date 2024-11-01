// frontend/srcs/js/PongGame/Game2D/score2D.js

import { gameSettings2D } from '../gameSettings.js';
import { currentMatchPlayers, isTournament, showWinMessageTournament } from '../../Screens/multiPlayers2D.js';
import { isTwoPlayerMode2D, showWinMessage } from '../../Modals/winMsgModal.js';

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

    // Determine player names based on game context
    let player1Name;
    let player2Name;

    if (isTournament) {
        player1Name = currentMatchPlayers.player1;
        player2Name = currentMatchPlayers.player2;
    }
    else {
        player1Name = getUserFromStorage();
        if (isTwoPlayerMode2D)
            player2Name = "Player 2";
        else
            player2Name = "Mr Robot";
    }

    document.getElementById('player1Score2D').textContent = `${player1Score2D} / ${winningScore}`;
    document.getElementById('player2Score2D').textContent = `${player2Score2D} / ${winningScore}`;

    document.querySelector('.score-container.left .username').textContent = player1Name;
    document.querySelector('.score-container.right .username').textContent = player2Name;
}


let gameOver2D = false;

export function isGameOver2D() {
    return gameOver2D;
}

export function setIsGameOver2D(value) {
    if (typeof value === 'boolean')
        gameOver2D = value;
    else
        console.warn("Invalid value. Please provide a boolean (true or false).");
}

export function getUserFromStorage() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.username ? userData.username : "Player 1";
}

export function checkGameEnd2D() {
    const winningScore = gameSettings2D.winningScore;

    // Determine player names based on game context
    let player1Name;
    let player2Name;

    if (isTournament) {
        player1Name = currentMatchPlayers.player1;
        player2Name = currentMatchPlayers.player2;
    }
    else {
        player1Name = getUserFromStorage();
        if (isTwoPlayerMode2D)
            player2Name = "Player 2";
        else
            player2Name = "Mr Robot";
    }

    if (player1Score2D >= winningScore) {
        gameOver2D = true;
        if (isTournament)
            showWinMessageTournament(player1Name);
        else
            showWinMessage("player", player1Name);
        return true;
    } 
    else if (player2Score2D >= winningScore) {
        gameOver2D = true;
        if (isTournament)
            showWinMessageTournament(player2Name);
        else
            showWinMessage("2", player2Name);
        return true;
    }
    return false;
}