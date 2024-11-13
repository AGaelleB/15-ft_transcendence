// frontend/srcs/js/Modals/dashboardModal.js

import { loadLanguages, updatePlaceholders } from './switchLanguages.js';

export async function openProfileModal() {
    const homeIcon = document.getElementById('homeIcon');
    homeIcon.classList.add('hidden');
    const modal = document.getElementById("profileModal");
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const avatarUrl = `http://127.0.0.1:8001/users/${user.username}/avatar/`;

        // Mise à jour de l'image de profil
        if (document.querySelector('.profile-modal-picture')) {
            document.querySelector('.profile-modal-picture').src = avatarUrl;
        }
        if (document.querySelector('.profile-link img')) {
            document.querySelector('.profile-link img').src = avatarUrl;
        }
    }

    try {
        const { loadLanguages, updatePlaceholdersProfil } = await import("./switchLanguages.js");
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        const translations = await loadLanguages(preferredLanguage);
        updatePlaceholdersProfil(translations);
    }
    catch (error) {
        console.error("Erreur lors de l'importation des traductions :", error);
    }

    modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(".edit-button");
    if (editButton) {
        editButton.addEventListener("click", () => {
            console.log("Bouton cliqué");
            openProfileModal();
        });
    }
    else {
        console.error("Le bouton de modification n'a pas été trouvé.");
    }
});

export function closeProfileModal() {
    const modal = document.getElementById("profileModal");
    modal.classList.add("hidden");
    homeIcon.classList.remove('hidden');
}

export function openDeleteProfileModal() {
    const deleteModal = document.getElementById("delete-profil-modal");
    deleteModal.classList.remove("hidden");
}

export function closeDeleteProfileModal() {
    const deleteModal = document.getElementById("delete-profil-modal");
    deleteModal.classList.add("hidden");
}

async function uploadNewProfilePicture(event) {
    const file = event.target.files[0];
    if (!file) {
        console.warn("No file selected");
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        console.warn("Aucun utilisateur connecté.");
        return;
    }

    const username = savedUser.username;

    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
            method: 'PUT',
            body: formData,
        });               

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload failed:", errorData);
            alert('Upload failed: ' + JSON.stringify(errorData));
            return;
        }

        const updatedUserData = await response.json();
        console.log("Avatar updated successfully:", updatedUserData);

        // Mise à jour de l'image de profil
        if (document.querySelector('.profile-modal-picture')) {
            document.querySelector('.profile-modal-picture').src = updatedUserData.avatar;
        }
        if (document.querySelector('.profile-link img')) {
            document.querySelector('.profile-link img').src = updatedUserData.avatar;
        }

        // Mise à jour dans localStorage
        savedUser.avatar = updatedUserData.avatar;
        localStorage.setItem('user', JSON.stringify(savedUser));

        console.log("Updated avatar URL in localStorage:", updatedUserData.avatar);
        event.preventDefault();
        window.history.pushState({}, "", "/profil");
        handleLocation();
    }
    catch (error) {
        console.error("Error during upload:", error);
        alert("An error occurred while uploading the avatar.");
    }
}

async function fetchAllUsers() {
    try {
        const response = await fetch("http://127.0.0.1:8001/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.ok ? await response.json() : [];
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function isEmailAvailable(email) {
    const allUsers = await fetchAllUsers();
    return !allUsers.some(user => user.email === email);
}

export async function saveUserProfileToBackendAndLocalStorage() {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        alert("No user logged in.");
        return;
    }

    const usernameInput = document.getElementById('username').value;
    const emailInput = document.getElementById('email').value;

    // Vérification de la disponibilité de l'email
    const isEmailAvailableForSave = await isEmailAvailable(emailInput);
    if (!isEmailAvailableForSave && emailInput !== savedUser.email) {
        alert("Cette adresse e-mail est déjà utilisée, veuillez en choisir une autre.");
        return;
    }

    const userData = {
        username: usernameInput,
        email: emailInput,
        profileImageUrl: `http://127.0.0.1:8001/users/${usernameInput}/avatar/`,
    };

    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${savedUser.username}/`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer <mettre_le_token_d_authentification>',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Échec de la mise à jour du profil:", errorData);
            alert("La mise à jour du profil a échoué: " + JSON.stringify(errorData));
            return;
        }

        const updatedUser = { ...savedUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        window.history.pushState({}, "", "/profil");
        handleLocation();
    } catch (error) {
        console.error('Erreur:', error);
        alert("Une erreur est survenue lors de la mise à jour du profil.");
    }
}

// Exporter les fonctions globalement
window.openProfileModal = openProfileModal;
window.uploadNewProfilePicture = uploadNewProfilePicture;

// Initialiser les événements des modales
export async function initializeModalEvents() {
    const profileModal = document.getElementById("profileModal");
    const closeProfileButton = profileModal ? profileModal.querySelector(".close-button") : null;
    const langSwitcher = document.getElementById("lang-switcher-profile");
    closeProfileButton.addEventListener("click", closeProfileModal);

    try {
        const { loadLanguages, updatePlaceholdersPassword } = await import("./switchLanguages.js");
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        const translations = await loadLanguages(preferredLanguage);
        updatePlaceholdersPassword(translations);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    document.getElementById('changePasswordBtn').addEventListener('click', () => {
        document.getElementById('passwordModal').classList.remove('hidden');
    });

    document.querySelector('.close-password-button').addEventListener('click', () => {
        document.getElementById('passwordModal').classList.add('hidden');
    });

    document.querySelector('.delete').addEventListener('click', (event) => {
        event.preventDefault();
        openDeleteProfileModal();
    });
        
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteProfileModal);

    document.getElementById('confirm-delete').addEventListener('click', async function(event) {
        event.preventDefault();
    
        // Récupère les données de l'utilisateur depuis le localStorage
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert("No user logged in.");
            return;
        }
    
        const user = JSON.parse(savedUser);
        const username = user.username;
    
        // Construire les données à envoyer dans la requête PUT pour déconnexion
        const userData = {
            "username": user.username,
            "first_name": "",
            "last_name": "",
            "email": user.email,
            "is_2fa": false,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error during delete:', errorData);
                alert('Delete failed: ' + JSON.stringify(errorData));
            }
            else {
                // Supprimer les informations de l'utilisateur du localStorage
                localStorage.removeItem('user');
                
                // Fermer le modal et rediriger vers la page de démarrage
                closeDeleteProfileModal();
                window.history.pushState({}, "", "/start");
                handleLocation();
                alert("Profil supprimé avec succès !");
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });


    // Vérifier si le bouton de fermeture du modal est présent
    if (closeProfileButton) {
        closeProfileButton.addEventListener("click", closeProfileModal);
    } else {
        console.warn("Le bouton de fermeture du modal n'a pas été trouvé.");
    }

    // Vérifier si le sélecteur de langue est présent
    if (langSwitcher) {
        try {
            const { loadLanguages, updatePlaceholdersPassword } = await import("./switchLanguages.js");
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            const translations = await loadLanguages(preferredLanguage);
            updatePlaceholdersPassword(translations);
        } catch (error) {
            console.error("Error loading translations:", error);
        }

        const languageButtonProfile = document.getElementById("language-button-profile");
        const dropdownItemsProfile = document.querySelectorAll('#language-dropdown-profile .dropdown-item-profile');

        if (languageButtonProfile && dropdownItemsProfile.length > 0) {
            const storedLangProfile = localStorage.getItem('preferredLanguage') || 'en';
            loadLanguages(storedLangProfile);
            updatePlaceholders(storedLangProfile);

            // Initialiser le drapeau en fonction de la langue enregistrée
            function setInitialFlagProfile() {
                const currentLang = languageButtonProfile.getAttribute("data-lang");
                dropdownItemsProfile.forEach(item => {
                    const itemLang = item.getAttribute("data-lang");
                    if (itemLang === storedLangProfile) {
                        const currentFlag = languageButtonProfile.innerHTML;
                        languageButtonProfile.innerHTML = item.innerHTML;
                        languageButtonProfile.setAttribute("data-lang", storedLangProfile);
                        item.innerHTML = currentFlag;
                        item.setAttribute("data-lang", currentLang);
                    }
                });
            }
            setInitialFlagProfile();

            // Fonction pour basculer le drapeau et la langue sélectionnée
            function switchFlagProfile(selectedItem) {
                const currentFlag = languageButtonProfile.innerHTML;
                const currentLang = languageButtonProfile.getAttribute("data-lang");
                languageButtonProfile.innerHTML = selectedItem.innerHTML;
                languageButtonProfile.setAttribute("data-lang", selectedItem.getAttribute("data-lang"));
                selectedItem.innerHTML = currentFlag;
                selectedItem.setAttribute("data-lang", currentLang);
                const newLang = languageButtonProfile.getAttribute("data-lang");
                localStorage.setItem('preferredLanguage', newLang);
                loadLanguages(newLang);
                updatePlaceholders(newLang);
            }

            // Ajouter les écouteurs d'événements pour chaque élément du menu déroulant
            dropdownItemsProfile.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    switchFlagProfile(item);
                });
            });
        } else {
            console.warn("Les éléments de sélection de langue n'ont pas été trouvés.");
        }
    } else {
        console.warn("Le sélecteur de langue n'a pas été trouvé.");
    }
}
