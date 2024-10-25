// frontend/srcs/js/PongGame/playerInfos.js

export function loadPlayerInfos() {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
        console.error("Les informations de l'utilisateur sont absentes du localStorage.");
        return;
    }

    // Maj du username pour le score
    const usernameElement = document.querySelector('.score-container.left .username');
    if (usernameElement) {
        usernameElement.textContent = userData.username;
    }
}
