// buttonsSettings.js

export function initializeButton() {
    const homeButton = document.getElementById('homeButton');
    const againButton = document.getElementById('againButton');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettings');

    settingsModal.style.display = 'none';
    // Ouvre le modal des paramètres
    settingsIcon.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    // Ferme le modal des paramètres
    closeSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Bouton "Home" redirige vers l'écran d'accueil
    homeButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });

    // Bouton "Play Again" redirige pour rejouer une partie
    againButton.addEventListener('click', function() {
        window.location.href = '1Player.html';
    });
}

export function showWinMessage(winner) {
    const winnerMessage = document.querySelector('.message');
    winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
}

export function startGame(settingsIcon, startGameMessage) {
    startGameMessage.style.display = 'none';
    settingsIcon.classList.add('hidden');
    return true;
}

// Ajoute un écouteur d'événement pour démarrer le jeu
export function initializeGameStartListener(startGame) {
    let gameStarted = false;
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && (e.code === 'Space' || e.code === 'Enter')) {
            gameStarted = startGame();
        }
    });
}
