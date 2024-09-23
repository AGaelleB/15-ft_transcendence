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