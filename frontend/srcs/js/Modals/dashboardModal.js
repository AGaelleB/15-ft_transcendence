// frontend/srcs/js/Modals/dashboardModal.js

export async function openProfileModal() {
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
        alert("Avatar mis à jour avec succès !");
    } catch (error) {
        console.error("Error during upload:", error);
        alert("An error occurred while uploading the avatar.");
    }
}

// Exporter les fonctions globalement
window.openProfileModal = openProfileModal;
window.uploadNewProfilePicture = uploadNewProfilePicture;

// Initialiser les événements des modales
export function initializeModalEvents() {
    const profileModal = document.getElementById("profileModal");
    const closeProfileButton = profileModal.querySelector(".close-button");

    closeProfileButton.addEventListener("click", closeProfileModal);
    const langSwitcher = document.getElementById("lang-switcher");

    langSwitcher.addEventListener("click", (event) => {
        if (event.target.classList.contains("flag")) {
            const selectedFlag = document.getElementById("selected-flag");
            selectedFlag.src = event.target.src;
            selectedFlag.alt = event.target.alt;
            // Sauvegarder la langue sélectionnée dans localStorage
            localStorage.setItem("preferredLanguage", event.target.dataset.lang);
        }
    });

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
}
