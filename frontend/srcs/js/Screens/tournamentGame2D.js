// frontend/srcs/js/Screens/tournamentGame2D.js

export function initializeTournament2D() {
    const homeIcon = document.getElementById('homeIcon');

    window.addEventListener('popstate', function(event) {
        console.log("Retour arrière du navigateur détecté !");
    });

    printTournamentParticipants();
}

function printTournamentParticipants() {
    const players = JSON.parse(localStorage.getItem('tournamentPlayers')) || [];
    console.log("Registered Tournament Participants:");
    players.forEach((player, index) => {
        console.log(`Player ${index + 1}: ${player}`);
    });
}
