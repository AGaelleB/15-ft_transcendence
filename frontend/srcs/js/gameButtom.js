// frontend/srcs/js/gameButtom.js

export function setupButtons(homeButton, againButton, settingsIcon, settingsModal, closeSettingsButton, startGameMessage) {
    // Modal settings
    settingsModal.style.display = 'none';
    settingsIcon.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    closeSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });


    // Start game
    let gameStarted = false;
    function startGame() {
        startGameMessage.style.display = 'none';
        settingsIcon.classList.add('hidden');
        gameStarted = true;
        
    }
    document.addEventListener('keydown', (e) => {
        if (!gameStarted && (e.code === 'Space' || e.code === 'Enter'))
            startGame();
    });

    // Redirection buttons
    homeButton.addEventListener('click', function() {
        window.location.href = 'homeScreen.html';
    });
    
    againButton.addEventListener('click', function() {
        window.location.href = '1Player.html';
    });

}
