// frontend/srcs/js/Screens/tournamentGame2D.js

export function initializeTounament2D() {
    const homeIcon = document.getElementById('homeIcon');

    window.addEventListener('popstate', function(event) {
        console.log("Retour arrière du navigateur détecté !");
    });

}
