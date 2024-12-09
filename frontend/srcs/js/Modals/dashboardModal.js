// frontend/srcs/js/Modals/dashboardModal.js

import { loadLanguages, updatePlaceholders, updateUserLanguage } from './switchLanguages.js';
import { myAlert } from './alertModal.js';

export async function openProfileModal() {
    const homeIcon = document.getElementById('homeIcon');
    homeIcon.classList.add('hidden');
    const modal = document.getElementById("profileModal");
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const avatarUrl = `http://127.0.0.1:8001/users/${user.username}/avatar/`;

        if (document.querySelector('.profile-modal-picture'))
            document.querySelector('.profile-modal-picture').src = avatarUrl;

        if (document.querySelector('.profile-link img'))
            document.querySelector('.profile-link img').src = avatarUrl;

        const enable2FACheckbox = document.getElementById("2fa");
        if (enable2FACheckbox)
            enable2FACheckbox.checked = user.is_2fa || false;
    }

    try {
        const { loadLanguages, updatePlaceholdersProfil } = await import("./switchLanguages.js");
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        const translations = await loadLanguages(preferredLanguage);
        updatePlaceholdersProfil(translations);
    }
    catch (error) {
        console.warn("Error loading translations:", error);
    }

    modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(".edit-button");
    if (editButton) {
        editButton.addEventListener("click", () => {
            openProfileModal();
        });
    }
});

async function toggle2FA(isEnabled) {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        await myAlert("noUserLoggedIn");
        return;
    }

    const userData = {
        "is_2fa": isEnabled,
    };

    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${savedUser.username}/`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to update 2FA:", errorData);
            await myAlert("2FAUpdateFailed", errorData);
            return;
        }

        const updatedUser = await response.json();
        console.log("2FA updated successfully:", updatedUser);

        const currentUser = JSON.parse(localStorage.getItem('user'));
        currentUser.is_2fa = updatedUser.is_2fa;
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
    catch (error) {
        console.error("Error updating 2FA:", error);
        await myAlert("2FAUpdateFailed");
    }
}

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
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        return;
    }

    const username = savedUser.username;

    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: formData,
        });               

        if (!response.ok) {
            const errorData = await response.json();
            console.warn("Upload failed:", errorData);
            return;
        }

        const updatedUserData = await response.json();

        if (document.querySelector('.profile-modal-picture')) {
            document.querySelector('.profile-modal-picture').src = updatedUserData.avatar;
        }
        if (document.querySelector('.profile-link img')) {
            document.querySelector('.profile-link img').src = updatedUserData.avatar;
        }

        savedUser.avatar = updatedUserData.avatar;
        localStorage.setItem('user', JSON.stringify(savedUser));

        event.preventDefault();
        window.history.pushState({}, "", "/profil");
        handleLocation();
    }
    catch (error) {
        console.warn("Error during upload:", error);
    }
}

async function fetchAllUsers() {
    try {
        const response = await fetch("http://127.0.0.1:8001/users/", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response.ok ? await response.json() : [];
    }
    catch (error) {
        console.warn("Error fetching users:", error);
        return [];
    }
}

export async function isEmailAvailable(email) {
    const allUsers = await fetchAllUsers();
    return !allUsers.some(user => user.email === email);
}

export async function saveUserProfileToBackendAndLocalStorage() {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        await myAlert("noUserLoggedIn");
        return;
    }

    const usernameInput = document.getElementById('username').value;
    const emailInput = document.getElementById('email').value;

    const isEmailAvailableForSave = await isEmailAvailable(emailInput);
    if (!isEmailAvailableForSave && emailInput !== savedUser.email) {
        await myAlert("emailUse");
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
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            await myAlert("profileUpdateFailed", errorData);
            return;
        }

        const updatedUser = { ...savedUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        window.history.pushState({}, "", "/profil");
        handleLocation();
    }
    catch (error) {
        console.error('Erreur:', error);
    }
}

window.openProfileModal = openProfileModal;
window.uploadNewProfilePicture = uploadNewProfilePicture;

async function openPasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    passwordModal.classList.remove('hidden');

    try {
        const { loadLanguages, updatePlaceholdersPassword } = await import("./switchLanguages.js");
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        const translations = await loadLanguages(preferredLanguage);
        updatePlaceholdersPassword(translations);
    }
    catch (error) {
        console.warn("Error loading translations:", error);
    }
}

async function handleSavePassword() {
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

    if (newPassword !== confirmNewPassword) {
        await myAlert("passwordsNotMatch", { message: "Passwords do not match." });
        return;
    }

    const passData = {
        "old_password": currentPassword,
        "new_password": newPassword
    };

    try {
        const response = await fetch("http://127.0.0.1:8001/reset-password/", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(passData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.non_field_errors)
                await myAlert("changePasswordFailed", { message: errorData.non_field_errors.join(", ") });
            else if (errorData.currentPassword)
                await myAlert("invalidCurrentPassword", { message: errorData.currentPassword.join(", ") });
            else
                await myAlert("changePasswordFailed", { message: "An unknown error occurred." });
            return;
        }

        closePasswordModal();
    }
    catch (error) {
        console.error("Error during password reset request:", error);
    }
}

function closePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    passwordModal.classList.add('hidden');
}

export async function initializeModalEvents() {
    const profileModal = document.getElementById("profileModal");
    const closeProfileButton = profileModal ? profileModal.querySelector(".close-button") : null;
    closeProfileButton.addEventListener("click", closeProfileModal);
    const langSwitcher = document.getElementById("lang-switcher-profile");

    const enable2FACheckbox = document.getElementById("2fa");

    if (enable2FACheckbox) {
        enable2FACheckbox.addEventListener("change", async (event) => {
            const isEnabled = event.target.checked;
            await toggle2FA(isEnabled);
        });
    }

    const changePasswordButton = document.getElementById('changePasswordBtn');
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', openPasswordModal);
    }

    const closePasswordButton = document.querySelector('.close-password-button');
    if (closePasswordButton) {
        closePasswordButton.addEventListener('click', closePasswordModal);
    }

    const togglePasswordIcons = document.querySelectorAll(".toggle-password-icon");

    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const passwordInput = icon.closest(".password-field").querySelector("input[type='password'], input[type='text']");

            if (passwordInput) {
                const isPasswordVisible = passwordInput.type === "text";
                passwordInput.type = isPasswordVisible ? "password" : "text";

                icon.classList.toggle("bi-eye");
                icon.classList.toggle("bi-eye-slash");
            }
            else
                console.error("Password input not found for icon:", icon);
        });
    });

    const savePasswordButton = document.getElementById("savePasswordBtn");
    if (savePasswordButton)
        savePasswordButton.addEventListener("click", handleSavePassword);

    document.querySelector('.delete').addEventListener('click', (event) => {
        event.preventDefault();
        openDeleteProfileModal();
    });
        
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteProfileModal);

    document.getElementById('confirm-delete').addEventListener('click', async function(event) {
        event.preventDefault();
    
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            await myAlert("noUserLoggedIn");
            return;
        }
    
        const user = JSON.parse(savedUser);
        const username = user.username;
    
        const userData = {
            "username": user.username,
            "email": user.email,
            "is_2fa": user.is_2fa,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
                method: 'DELETE',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error during delete:', errorData);
            }
            else {
                localStorage.removeItem('user');
                
                closeDeleteProfileModal();
                window.history.pushState({}, "", "/start");
                handleLocation();
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });


    closeProfileButton.addEventListener("click", closeProfileModal);


    if (langSwitcher) {
        const languageButtonProfile = document.getElementById("language-button-profile");
        const dropdownItemsProfile = document.querySelectorAll('#language-dropdown-profile .dropdown-item-profile');

        if (languageButtonProfile && dropdownItemsProfile.length > 0) {
            const storedLangProfile = localStorage.getItem('preferredLanguage') || 'en';
            loadLanguages(storedLangProfile);
            updatePlaceholders(storedLangProfile);

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
            
                updateUserLanguage(newLang);
            }

            dropdownItemsProfile.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    switchFlagProfile(item);
                });
            });
        }
    }
}
