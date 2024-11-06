// frontend/srcs/js/Screens/homeScreen.js

import { loadLanguages } from '../Modals/switchLanguages.js';

export function initializeHome() {
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

    function getTargetPath(gameMode) {
        if (gameMode === '1 PLAYER 2D' || gameMode === '1 joueur 2D' || gameMode === '1 jugador 2D')
            return '/1player-2d';
        else if (gameMode === '1 PLAYER 3D' || gameMode === '1 joueur 3D' || gameMode === '1 jugador 3D')
            return '/1player-3d';
        else if (gameMode === '2 PLAYERS 2D' || gameMode === '2 joueurs 2D' || gameMode === '2 jugadores 2D')
            return '/2players-2d';
        else if (gameMode === '2 PLAYERS 3D' || gameMode === '2 joueurs 3D' || gameMode === '2 jugadores 3D')
            return '/2players-3d';
        else if (gameMode === 'TOURNAMENT 2D' || gameMode === 'Tournoi 2D' || gameMode === 'Torneo 2D')
            return '/tournament-2d';
        else if (gameMode === 'TOURNAMENT 3D' || gameMode === 'Tournoi 3D' || gameMode === 'Torneo 3D')
            return '/tournament-3d';
        else
            console.error('Error: Mode de jeu non défini');
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
    
            const mode = item.innerText.trim();  // "1 PLAYER", "2 PLAYERS", "TOURNAMENT"
            localStorage.setItem('gameMode', mode);
    
            const targetPath = getTargetPath(mode);
            window.history.pushState({}, "", targetPath);
    
            handleLocation();
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
    
            // Utilise également pushState pour la navigation par clavier
            const targetPath = getTargetPath(mode);
            window.history.pushState({}, "", targetPath);
    
            handleLocation();
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
    const profileLink = document.querySelector('.profile-link');

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

    confirmLogoutButton.addEventListener('click', async function(event) {
        event.preventDefault();
    
        // Récupère les données de l'utilisateur depuis le localStorage
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert("No user logged in.");
            return;
        }
    
        const user = JSON.parse(savedUser);
        const userId = user.id;
        // console.log("user ID: ", userId);
        // console.log("user name: ", user.username);
    
        // Construire les données à envoyer dans la requête PUT pour déconnexion
        const userData = {
            "username": user.username,
            "first_name": "",
            "last_name": "",
            "email": user.email,
            "is_2fa": false,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8001/users/${userId}/logout/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error during logout:', errorData);
                alert('Logout failed: ' + JSON.stringify(errorData));
            }
            else {
                // Supprimer les informations de l'utilisateur du localStorage
                localStorage.removeItem('user');
                
                // Fermer le modal et rediriger vers la page de démarrage
                closeModal();
                alert('Logout successful!');
                window.history.pushState({}, "", "/start");
                handleLocation();
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
    

    profileLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/profil");
        handleLocation();
    });

    cancelLogoutButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    updateSelection();
}
