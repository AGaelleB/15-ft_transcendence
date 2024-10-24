// frontend/srcs/js/Modals/winMsgModal.js

// import { resetGame2D } from "./startGameModal2D";
// import { initialize1Player2D } from "../Screens/1Player2D";

export function showWinMessage(winner) {
    // Récupérer l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('user');
    let username = 'Player';  // Valeur par défaut si l'utilisateur n'est pas trouvé

    if (savedUser) {
        const user = JSON.parse(savedUser);
        username = user.username || 'Player';  // Utiliser le pseudo de l'utilisateur
    }

    // Modifier le contenu du modal avec le pseudo de l'utilisateur et le gagnant
    const modal = document.querySelector('.modal');
    const messageElement = modal.querySelector('.message');

    messageElement.innerHTML = `
        <span data-lang-key="winner">${username} ${winner} Wins!</span>
        <i class="bi bi-emoji-sunglasses"></i>
    `;

    // Afficher la modal
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

        if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D') {
            targetPath = '/1player-2d';
            // initialize1Player2D(); 
            // resetGame2D();
        }
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
