// frontend/srcs/js/PongGame/Game2D/score2D.js

import { gameSettings2D } from '../gameSettings.js';
import { currentMatchPlayers2D, isTournament2D, showWinMessageTournament2D } from '../../Screens/tournament2D.js';
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

    if (isTournament2D) {
        player1Name = currentMatchPlayers2D.player1;
        player2Name = currentMatchPlayers2D.player2;
    }
    else {
        player1Name = getUserFromStorage2D();
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
}

export function getUserFromStorage2D() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.username ? userData.username : "Player 1";
}

export function checkGameEnd2D() {
    const winningScore = gameSettings2D.winningScore;

    let player1Name;
    let player2Name;

    if (isTournament2D) {
        player1Name = currentMatchPlayers2D.player1;
        player2Name = currentMatchPlayers2D.player2;
    }
    else {
        player1Name = getUserFromStorage2D();
        if (isTwoPlayerMode2D)
            player2Name = "Player 2";
        else
            player2Name = "Mr Robot";
    }

    if (player1Score2D >= winningScore) {
        gameOver2D = true;
        //ici
        if (isTournament2D)
            showWinMessageTournament2D(player1Name);
        else
            showWinMessage("player", player1Name);
        return true;
    } 
    else if (player2Score2D >= winningScore) {
        gameOver2D = true;
        //ici
        if (isTournament2D)
            showWinMessageTournament2D(player2Name);
        else
            showWinMessage("2", player2Name);
        return true;
    }
    return false;
    
}

export async function sendGameResult(score, opp_score, player, game_mode, game_played, result) {
    const gameData = {
        "score": score,
        "opp_score": opp_score,
        "player": player,
        "game_mode": game_mode,
        "game_played": game_played,
        "result": result,
    };

    try {
        const response = await fetch('http://127.0.0.1:8001/games/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(gameData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error sending game result:', errorData);
        }
    }
    catch (error) {
        console.error('Network error when sending game result:', error);
    }
}
