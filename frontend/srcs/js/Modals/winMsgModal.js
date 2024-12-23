// frontend/srcs/js/Modals/winMsgModal.js

export let isTwoPlayerMode2D = false;
export let isTwoPlayerMode3D = false;

export function setTwoPlayerMode2D(value) {
    isTwoPlayerMode2D = value;
}

export function setTwoPlayerMode3D(value) {
    isTwoPlayerMode3D = value;
}

export async function showWinMessage(winner, username = null) {
    const modal = document.querySelector('.modal');
    const messageElement = modal.querySelector('.message');
    let translations = {};

    if (!username) {
        const userData = JSON.parse(localStorage.getItem('user'));
        username = userData && userData.username ? userData.username : "Player";
    }

    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.warn('Error loading translations:', error);
    }

    let opponentName;
    if (isTwoPlayerMode2D)
        opponentName = "Player 2";
    else if (isTwoPlayerMode3D)
        opponentName = "Player 2";
    else
        opponentName = "Mr Robot";

    const player1Name = username;

    let winnerText = "";
    if (winner === "player")
        winnerText = translations.winner.replace("${winner}", player1Name);
    else if (winner === "2")
        winnerText = translations.winner.replace("${winner}", opponentName);
    else
        winnerText = translations.winner.replace("${winner}", winner);

    messageElement.innerHTML = `
        <span>${winnerText}</span>
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
        else if (gameMode === 'TOURNAMENT 2D' || gameMode === 'tournoi 2D' || gameMode === 'Torneo 2D')
            targetPath = '/tournament-2d';
        else if (gameMode === 'TOURNAMENT 3D' || gameMode === 'tournoi 3D' || gameMode === 'Torneo 3D')
            targetPath = '/tournament-3d';
        else
            console.error('Error: Mode de jeu non défini');

        window.history.pushState({}, "", targetPath);
        handleLocation();
    });
}

/****************************** Tournament ******************************/

export function initializeWinMsgTournament() {
    const nextMatchButton = document.getElementById('nextMatchButton');
    if (nextMatchButton) {
        nextMatchButton.addEventListener('click', () => {
            const modal = document.getElementById('winMsgModal');
            modal.style.display = 'none';
        });
    }
}

