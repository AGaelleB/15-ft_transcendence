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

    function selectFirstOption() {
        currentIndex = 0;
        updateSelection();
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
        }
        else if (event.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
            updateSelection();
        }
        else if (event.key === 'Enter') {
            const selectedItem = menuItems[currentIndex];

            const mode = selectedItem.innerText.trim();
            localStorage.setItem('gameMode', mode);

            window.location.href = selectedItem.getAttribute('href');
        }
    });

    const game2dRadio = document.getElementById('game2d');
    const game3dRadio = document.getElementById('game3d');
    const menu2d = document.querySelector('.menu-2d');
    const menu3d = document.querySelector('.menu-3d');

    const selectedGameMode = localStorage.getItem('selectedGameMode');

    if (selectedGameMode === '3D') {
        game3dRadio.checked = true;
        menu2d.style.display = 'none';
        menu3d.style.display = 'block';
    }
    else {
        game2dRadio.checked = true;
        menu2d.style.display = 'block';
        menu3d.style.display = 'none';
    }

    selectFirstOption();

    game2dRadio.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('selectedGameMode', '2D');
            menu2d.style.display = 'block';
            menu3d.style.display = 'none';
            selectFirstOption();
        }
    });

    game3dRadio.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('selectedGameMode', '3D');
            menu2d.style.display = 'none';
            menu3d.style.display = 'block';
            selectFirstOption();
        }
    });

    const overlay = document.getElementById('overlay');
    const logoutLink = document.querySelector('.logout-link');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const cancelLogoutButton = document.getElementById('cancel-logout');

    function openModal() {
        overlay.style.display = 'block';
        logoutModal.style.display = 'flex';
    }

    function closeModal() {
        overlay.style.display = 'none';
        logoutModal.style.display = 'none';
    }

    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        openModal();
    });

    confirmLogoutButton.addEventListener('click', function() {
        closeModal();
        window.location.href = "../index.html";
    });

    cancelLogoutButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    updateSelection();
});