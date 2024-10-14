// frontend/srcs/js/Screens/userDashboard.js

export function initializeProfil() {

    const confirmHomeButton = document.querySelector('.home-link');

    confirmHomeButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
}