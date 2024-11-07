// frontend/srcs/js/Screens/userDashboard.js

import { openProfileModal, initializeModalEvents } from "../Modals/dashboardModal.js";
import { initializeFriendsModalEvents, openFriendsModal } from "../Modals/friendsModal.js";
import { loadLanguages } from "../Modals/switchLanguages.js";

export function loadUserProfileFromLocalStorage() {
    // Récupère les données de l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        console.warn("Aucun utilisateur connecté.");
        return;
    }

    const user = JSON.parse(savedUser);

    // URL de l'avatar dynamique basée sur le username
    const avatarUrl = `http://127.0.0.1:8001/users/${user.username}/avatar/`;

    // Mettre à jour les éléments de la section de profil avec les données de l'utilisateur
    document.querySelector('.profile-picture img').src = avatarUrl;
    document.querySelector('.username-dash').textContent = user.username || 'Nom d\'utilisateur';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
}

export function saveUserProfileToLocalStorage() {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const username = document.getElementById('username').value;

    const user = {
        ...savedUser,
        username,
        email: document.getElementById('email').value,
        profileImageUrl: `http://127.0.0.1:8001/users/${username}/avatar/`,
    };

    // Enregistre les informations modifiées dans le localStorage
    localStorage.setItem('user', JSON.stringify(user));
    console.log("User data saved to localStorage:", user);
}

export function initializeProfil() {
    const storedLang = localStorage.getItem('preferredLanguage') || 'en'; // fait bugger 
    loadLanguages(storedLang); // fait bugger 
    loadUserProfileFromLocalStorage();
    const confirmHomeButton = document.querySelector('.home-link');

    confirmHomeButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });

    const editButton = document.querySelector('.edit-button');
    editButton.addEventListener('click', openProfileModal);

    const expandFriendsBtn = document.getElementById('expandFriendsBtn');
    expandFriendsBtn.addEventListener('click', openFriendsModal);    
   
    
    document.querySelector('.save-info-btn').addEventListener('click', async function(event) {
        event.preventDefault();
        
        const savedUserToModifie = localStorage.getItem('user');
        if (!savedUserToModifie) {
            alert("No user logged in.");
            return;
        }
        
        const userToModifie = JSON.parse(savedUserToModifie);
        const usernameToModifie = userToModifie.username;
        
        saveUserProfileToLocalStorage();
        
        // Récupère les données de l'utilisateur depuis le localStorage
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert("No user logged in.");
            return;
        }
        
        const user = JSON.parse(savedUser);
        const avatarUrl = `http://127.0.0.1:8001/users/${usernameToModifie}/avatar/`;
        
        console.log("User data to be updated with:", {
            username: user.username,
            email: user.email,
            avatarUrl
        });
        
        // Construire les données à envoyer pour la mise à jour du profil
        const userData = {
            "username": user.username,
            "email": user.email,
            "profileImageUrl": avatarUrl,
        };
        
        try {
            // Mettez à jour l'URL du bon endpoint pour la mise à jour du profil
            const response = await fetch(`http://127.0.0.1:8001/users/${usernameToModifie}/`, {
                method: 'PUT', // ou 'PATCH' si seulement quelques champs sont mis à jour
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Profile update failed:", errorData);
                alert('Profile update failed: ' + JSON.stringify(errorData));
            }
            else {
                window.history.pushState({}, "", "/profil");
                handleLocation();
                alert('Informations de profil mises à jour!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the profile.');
        }
    });
    
    initializeModalEvents();
    initializeFriendsModalEvents();

    // Configuration du graphique
    const ctx = document.getElementById('victoryChart').getContext('2d');
    const noGamesPlayedData = [100];
    const defaultColor = ['#28a745'];

    const victoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Victoires'],
            datasets: [{
                data: noGamesPlayedData,
                backgroundColor: defaultColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            layout: {
                padding: 0
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function() {
                            return '0 partie jouée';
                        }
                    }
                }
            }
        }
    });
}
