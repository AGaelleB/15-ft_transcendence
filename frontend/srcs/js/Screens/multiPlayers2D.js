// frontend/srcs/js/Screens/multiPlayers2D.js

// import { loadLanguages } from "../Modals/switchLanguages";
// import { loadPlayerInfos } from "../PongGame/playerInfos";

export function initializeMulti2D() {
    // const startGameMessage3D = document.getElementById('startGameMessage3D');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    // const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    // loadLanguages(storedLang);
    // loadPlayerInfos();

    homeIcon.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });

    window.addEventListener('popstate', function(event) {
        console.log("Retour arrière du navigateur détecté !");
        cleanup1Player2D();
    });

}