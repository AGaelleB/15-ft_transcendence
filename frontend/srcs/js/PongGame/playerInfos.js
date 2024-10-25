// frontend/srcs/js/PongGame/playerInfos.js

export function loadPlayerInfos() {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
        console.error("Les informations de l'utilisateur sont absentes du localStorage.");
        return;
    }

    // Mettre à jour le nom d'utilisateur dans la section de score
    const usernameElement = document.querySelector('.score-container.left .username');
    if (usernameElement) {
        usernameElement.textContent = userData.username;
    }
}
