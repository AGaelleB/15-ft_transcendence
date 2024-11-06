// frontend/srcs/js/PongGame/playerInfos.js

import { currentMatchPlayers2D, isTournament2D } from "../Screens/multiPlayers2D.js";
import { currentMatchPlayers3D, isTournament3D } from "../Screens/multiPlayers3D.js";



export function loadPlayerInfos() {

    // pour tournois, noms dans le localstorage
    const tournamentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers'));
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
        console.error("User information is missing from localStorage.");
        return;
    }

    const player1NameElement = document.querySelector('.score-container.left .username');
    const player2NameElement = document.querySelector('.score-container.right .username');

    // if (isTournament2D && tournamentPlayers) {
    //     if (player1NameElement) {
    //         if (currentMatchPlayers2D.player1)
    //             player1NameElement.textContent = currentMatchPlayers2D.player1;
    //         else
    //             player1NameElement.textContent = tournamentPlayers[0];
    //     }
    //     if (player2NameElement) {
    //         if (currentMatchPlayers2D.player2)
    //             player2NameElement.textContent = currentMatchPlayers2D.player2;
    //         else
    //             player2NameElement.textContent = tournamentPlayers[1];
    //     }
    // }
    // else { // hors tournoi
    //     if (player1NameElement) {
    //         if (userData.username)
    //             player1NameElement.textContent = userData.username;
    //         else
    //             player1NameElement.textContent = "Player 1";
    //     }
    //     if (player2NameElement)
    //         player2NameElement.textContent = "Mr Robot";
    // }


    if (isTournament2D && tournamentPlayers) {
        // Mode tournoi 2D
        if (player1NameElement) {
            player1NameElement.textContent = currentMatchPlayers2D.player1 || tournamentPlayers[0];
        }
        if (player2NameElement) {
            player2NameElement.textContent = currentMatchPlayers2D.player2 || tournamentPlayers[1];
        }
    }
    else if (isTournament3D && tournamentPlayers) {
        // Mode tournoi 3D
        if (player1NameElement) {
            player1NameElement.textContent = currentMatchPlayers3D.player1 || tournamentPlayers[0];
        }
        if (player2NameElement) {
            player2NameElement.textContent = currentMatchPlayers3D.player2 || tournamentPlayers[1];
        }
    }
    else {
        // Mode hors tournoi
        if (player1NameElement) {
            player1NameElement.textContent = userData.username || "Player 1";
        }
        if (player2NameElement) {
            player2NameElement.textContent = "Mr Robot";
        }
    }




}

