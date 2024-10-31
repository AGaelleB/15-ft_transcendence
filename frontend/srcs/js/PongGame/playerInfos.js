// frontend/srcs/js/PongGame/playerInfos.js

import { currentMatchPlayers, isTournament } from "../Screens/multiPlayers2D.js";

export function loadPlayerInfos() {

    // pour les tournois, noms dans le localstorage
    const tournamentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers'));
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
        console.error("User information is missing from localStorage.");
        return;
    }

    const player1NameElement = document.querySelector('.score-container.left .username');
    const player2NameElement = document.querySelector('.score-container.right .username');

    if (isTournament && tournamentPlayers) {
        if (player1NameElement) {
            if (currentMatchPlayers.player1)
                player1NameElement.textContent = currentMatchPlayers.player1;
            else
                player1NameElement.textContent = tournamentPlayers[0];
        }
        if (player2NameElement) {
            if (currentMatchPlayers.player2)
                player2NameElement.textContent = currentMatchPlayers.player2;
            else
                player2NameElement.textContent = tournamentPlayers[1];
        }
    }
    else { // hors tournoi
        if (player1NameElement) {
            if (userData.username)
                player1NameElement.textContent = userData.username;
            else
                player1NameElement.textContent = "Player 1";
        }
        if (player2NameElement)
            player2NameElement.textContent = "Mr Robot";
    }
}

