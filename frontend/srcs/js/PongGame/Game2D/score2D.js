// frontend/srcs/js/score3D.js

import { gameSettings2D } from '../gameSettings.js';
import { isTournament, showWinMessageTournament } from '../../Screens/multiPlayers2D.js';
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

// export function updateScore2D() {
//     const winningScore = gameSettings2D.winningScore;
//     document.getElementById('player1Score2D').textContent = `${player1Score2D} / ${winningScore}`;
//     document.getElementById('player2Score2D').textContent = `${player2Score2D} / ${winningScore}`;
// }

export function updateScore2D() {
    const winningScore = gameSettings2D.winningScore;

    if (isTournament) {
        const tournamentPlayers = JSON.parse(localStorage.getItem("tournamentPlayers")) || [];
        const player1Name = tournamentPlayers[0] || "Player 1";
        const player2Name = tournamentPlayers[1] || "Player 2";

        document.getElementById('player1Score2D').textContent = `${player1Name}: ${player1Score2D} / ${winningScore}`;
        document.getElementById('player2Score2D').textContent = `${player2Name}: ${player2Score2D} / ${winningScore}`;
    }
    else {
        document.getElementById('player1Score2D').textContent = `${player1Score2D} / ${winningScore}`;
        document.getElementById('player2Score2D').textContent = `${player2Score2D} / ${winningScore}`;
    }
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

// export function checkGameEnd2D() {
//     const winningScore = gameSettings2D.winningScore;
//     let username = "Player";

//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//         const user = JSON.parse(savedUser);
//         if (user.username) username = user.username;
//     }

//     if (player1Score2D >= winningScore) {
//         gameOver2D = true;
//         // console.log("checkGameEnd2D isTournament = ", isTournament);
//         if (isTournament)
//             showWinMessageTournament(username);
//         else
//             showWinMessage("player", username);
//         return true;
//     } 
//     else if (player2Score2D >= winningScore) {
//         gameOver2D = true;
//         if (isTournament)
//             showWinMessageTournament("2");
//         else
//             showWinMessage("2");
//         return true;
//     }
//     return false;
// }

export function checkGameEnd2D() {
    const winningScore = gameSettings2D.winningScore;

    // Charger les noms des joueurs du tournoi
    const tournamentPlayers = JSON.parse(localStorage.getItem("tournamentPlayers")) || [];
    const player1Name = tournamentPlayers[0] || "Player 1";
    const player2Name = tournamentPlayers[1] || "Player 2";

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