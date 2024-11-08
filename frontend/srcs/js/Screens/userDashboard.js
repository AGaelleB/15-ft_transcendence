// frontend/srcs/js/Screens/userDashboard.js

import { openProfileModal, initializeModalEvents } from "../Modals/dashboardModal.js";
import { initializeFriendsModalEvents, openFriendsModal } from "../Modals/friendsModal.js";
import { loadLanguages } from "../Modals/switchLanguages.js";
import { initializeHistoryModal } from "../Modals/historyModal.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeProfil();
});

export function loadUserProfileFromLocalStorage() {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        console.warn("Aucun utilisateur connecté.");
        return;
    }

    const user = JSON.parse(savedUser);
    const avatarUrl = `http://127.0.0.1:8001/users/${user.username}/avatar/`;

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

    localStorage.setItem('user', JSON.stringify(user));
    console.log("User data saved to localStorage:", user);
}

export function initializeProfil() {
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);
    loadUserProfileFromLocalStorage();

    document.querySelector('.home-link').addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });

    document.querySelector('.edit-button').addEventListener('click', openProfileModal);
    document.getElementById('expandFriendsBtn').addEventListener('click', openFriendsModal);

    document.querySelector('.save-info-btn').addEventListener('click', async (event) => {
        event.preventDefault();
        
        if (!localStorage.getItem('user')) {
            alert("No user logged in.");
            return;
        }
        
        saveUserProfileToLocalStorage();
    });
    
    initializeHistoryModal();
    initializeModalEvents();
    initializeFriendsModalEvents();
}
