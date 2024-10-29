// frontend/srcs/js/Modals/winMsgModal.js

export function showWinMessage(winner, username = 'Player') {
    const modal = document.querySelector('.modal');
    const messageElement = modal.querySelector('.message');

    const opponentName = document.getElementById('opponentName') ? "Mr Robot" : `Player ${winner}`;

    let winnerText;
    if (winner === "player")
        winnerText = `${username} Wins!`;
    else if (winner === "2")
        winnerText = `${opponentName} Wins!`;
    else
        winnerText = `${winner} Wins!`;

    messageElement.innerHTML = `
        <span data-lang-key="winner">${winnerText}</span>
        <i class="bi bi-emoji-sunglasses"></i>
    `;

    modal.style.display = 'block';
}

export function initializeWinMsg() {
    const homeButton = document.getElementById('homeButton');
    const againButton = document.getElementById('againButton');

    homeButton.addEventListener('click', function() {
        window.history.pushState({}, "", '/home');
        handleLocation();
    });

    againButton.addEventListener('click', function() {
        const gameMode = localStorage.getItem('gameMode');

        let targetPath = '/home';

        if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
            targetPath = '/1player-2d';
        else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
            targetPath = '/1player-3d';
        else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
            targetPath = '/2players-2d';
        else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
            targetPath = '/2players-3d';
        else if (gameMode === 'MULTI PLAYERS 2D' || gameMode === 'Multijoueur 2D' || gameMode === 'multijugadores 2D')
            targetPath = '/multi-2d';
        else if (gameMode === 'MULTI PLAYERS 3D' || gameMode === 'Multijoueur 3D' || gameMode === 'multijugadores 3D')
            targetPath = '/multi-3d';
        else
            console.error('Error: Mode de jeu non défini');

        window.history.pushState({}, "", targetPath);
        handleLocation();
    });
}


/****************************** Tournament ******************************/

export function showWinMessageTournament(winnerName) {
    const modal = document.getElementById('winMsgModal');
    const winnerMessage = document.getElementById('winnerMessage');
    const nextMatchButton = document.getElementById('nextMatchButton');
    
    if (!modal || !winnerMessage || !nextMatchButton) {
        console.error("Tournament modal elements are missing in the DOM.");
        return;
    }
    
    // Populate the winner's name
    winnerMessage.textContent = `Congratulations, ${winnerName || 'Player'}!`;
    modal.style.display = 'block';
    
    // Call the tournament-specific initialization
    initializeWinMsgTournament();
}

export function initializeWinMsgTournament() {
    const nextMatchButton = document.getElementById('nextMatchButton');
    if (nextMatchButton) {
        nextMatchButton.addEventListener('click', () => {
            const modal = document.getElementById('winMsgModal');
            modal.style.display = 'none';
            startNextMatch(); // Start the next match based on tournament logic
        });
    }
}

// Function to handle navigation for the next match
function startNextMatch() {
    // Read from tournament match queue in localStorage or elsewhere
    const matchQueue = JSON.parse(localStorage.getItem("tournamentMatches")) || [];
    if (matchQueue.length === 0) {
        alert("Tournament Complete!");
        window.history.pushState({}, "", "/home");
        handleLocation();
    }
    else {
        const nextMatch = matchQueue.shift();
        localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));
        if (nextMatch.player2 === "AI")
            window.history.pushState({}, "", "/1player-2d");
        else
            window.history.pushState({}, "", "/2players-2d");
        handleLocation();
    }
}
