// frontend/srcs/js/Screens/homeScreen.js

import { loadLanguages } from '../Modals/switchLanguages.js';

document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);

    let currentIndex = 0;
    let keyboardNavigationEnabled = true;

    function updateSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentIndex)
                item.parentElement.classList.add('selected');
            else
                item.parentElement.classList.remove('selected');
        });
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            keyboardNavigationEnabled = false;
            currentIndex = index;
            updateSelection();
        });

        item.addEventListener('mouseleave', function() {
            keyboardNavigationEnabled = true;
        });

        item.addEventListener('click', function(event) {
            event.preventDefault();

            const mode = item.innerText.trim();  // "1 PLAYER", "2 PLAYERS", "MULTI PLAYERS"
            localStorage.setItem('gameMode', mode);

            window.location.href = item.getAttribute('href');
        });
    });

    document.addEventListener('keydown', function(event) {
        if (!keyboardNavigationEnabled) return;

        if (event.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
            currentIndex++;
            updateSelection();
        } else if (event.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
            updateSelection();
        } else if (event.key === 'Enter') {
            const selectedItem = menuItems[currentIndex];

            const mode = selectedItem.innerText.trim();
            localStorage.setItem('gameMode', mode);

            window.location.href = selectedItem.getAttribute('href');
        }
    });

    // Obtenir les éléments pour le modal
    const logoutLink = document.querySelector('.logout-link');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const cancelLogoutButton = document.getElementById('cancel-logout');

    // Lorsque l'icône de déconnexion est cliquée, afficher le modal
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher la redirection immédiate
        logoutModal.style.display = 'flex';
    });

    // Si l'utilisateur confirme la déconnexion
    confirmLogoutButton.addEventListener('click', function() {
        window.location.href = "../index.html"; // Rediriger vers la page d'accueil
    });

    // Si l'utilisateur annule la déconnexion
    cancelLogoutButton.addEventListener('click', function() {
        logoutModal.style.display = 'none'; // Cacher le modal
    });

    // Si on clique en dehors du modal, on le ferme
    window.addEventListener('click', function(event) {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    updateSelection();
});
