// frontend/srcs/js/Screens/userDashboard.js

import { openProfileModal, initializeModalEvents, saveUserProfileToBackendAndLocalStorage } from "../Modals/dashboardModal.js";
import { initializeFriendsModalEvents, initializeFriendsPreview, openFriendsModal } from "../Modals/friendsModal.js";
import { loadLanguages } from "../Modals/switchLanguages.js";
import { initializeHistoryModal, initializePreviewStats } from "../Modals/historyModal.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeProfil();
});

export function loadUserProfileFromLocalStorage() {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        return;
    }

    const user = JSON.parse(savedUser);
    const avatarUrl = `http://127.0.0.1:8001/users/${user.username}/avatar/`;

    document.querySelector('.profile-picture img').src = avatarUrl;
    document.querySelector('.username-dash').textContent = user.username || 'Nom d\'utilisateur';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
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
        await saveUserProfileToBackendAndLocalStorage();
    });
    
    initializeFriendsPreview();
    initializePreviewStats();
    initializeHistoryModal();
    initializeModalEvents();
    initializeFriendsModalEvents();
}
