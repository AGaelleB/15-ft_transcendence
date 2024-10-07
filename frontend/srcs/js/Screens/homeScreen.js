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


    // menus en fonction du mode 2D/3D
    const game2dRadio = document.getElementById('game2d');
    const game3dRadio = document.getElementById('game3d');
    const menu2d = document.querySelector('.menu-2d');
    const menu3d = document.querySelector('.menu-3d');

    game2dRadio.addEventListener('change', function () {
        if (this.checked) {
            menu2d.style.display = 'block';
            menu3d.style.display = 'none';
        }
    });

    game3dRadio.addEventListener('change', function () {
        if (this.checked) {
            menu2d.style.display = 'none';
            menu3d.style.display = 'block';
        }
    });


    // Obtenir les éléments pour le modal
    const overlay = document.getElementById('overlay'); // Ajout de l'élément overlay
    const logoutLink = document.querySelector('.logout-link');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const cancelLogoutButton = document.getElementById('cancel-logout');

    // Fonction pour ouvrir le modal et afficher l'overlay
    function openModal() {
        overlay.style.display = 'block';
        logoutModal.style.display = 'flex'; // Ou 'block' selon ta préférence
    }

    // Fonction pour fermer le modal et cacher l'overlay
    function closeModal() {
        overlay.style.display = 'none';
        logoutModal.style.display = 'none';
    }

    // Lorsque l'icône de déconnexion est cliquée, afficher le modal
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher la redirection immédiate
        openModal(); // Appel de la fonction pour ouvrir le modal
    });

    // Si l'utilisateur confirme la déconnexion
    confirmLogoutButton.addEventListener('click', function() {
        closeModal(); // Fermer le modal avant de rediriger
        window.location.href = "../index.html"; // Rediriger vers la page d'accueil
    });

    // Si l'utilisateur annule la déconnexion
    cancelLogoutButton.addEventListener('click', closeModal);
    
    // Si on clique en dehors du modal, on le ferme
    overlay.addEventListener('click', closeModal);

    updateSelection();
});
