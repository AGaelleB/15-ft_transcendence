// frontend/srcs/js/Screens/startScreen.js

import { loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    loginButton.addEventListener("click", function() {
        window.location.href = "./html/loginSignUp.html#login";
    });
    
    signupButton.addEventListener("click", function() {
        window.location.href = "./html/loginSignUp.html#signup";
    });

    let keyboardNavigationEnabled = true;

    function clearFocus() {
        loginButton.blur();
        signupButton.blur();
    }

    clearFocus();

    document.addEventListener('keydown', (event) => {
        if (!keyboardNavigationEnabled) return;

        if (event.key === 'ArrowRight') {
            signupButton.focus();
            event.preventDefault();
        }
        else if (event.key === 'ArrowLeft') {
            loginButton.focus();
            event.preventDefault();
        }
    });

    loginButton.addEventListener('mouseenter', () => {
        keyboardNavigationEnabled = false;
        loginButton.focus();
        signupButton.blur();
    });

    signupButton.addEventListener('mouseenter', () => {
        keyboardNavigationEnabled = false;
        signupButton.focus();
        loginButton.blur();
    });

    loginButton.addEventListener('mouseleave', () => {
        clearFocus();
        keyboardNavigationEnabled = true;
    });

    signupButton.addEventListener('mouseleave', () => {
        clearFocus();
        keyboardNavigationEnabled = true;
    });

    const langSwitcher = document.getElementById("lang-switcher");
    const languageButton = document.getElementById("language-button");
    const dropdownItems = document.querySelectorAll('#language-dropdown .dropdown-item');

    // Charger la langue stockée
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);
    updatePlaceholders(storedLang);

    // Fonction pour échanger les drapeaux
    function switchFlag(selectedItem) {
        // Obtenir le drapeau et la langue actuellement affichés
        const currentFlag = languageButton.innerHTML; // Le drapeau actuellement affiché
        const currentLang = languageButton.getAttribute("data-lang");

        // Mettre à jour le bouton principal avec le drapeau sélectionné
        languageButton.innerHTML = selectedItem.innerHTML;
        languageButton.setAttribute("data-lang", selectedItem.getAttribute("data-lang"));

        // Mettre à jour l'option sélectionnée dans le menu déroulant
        selectedItem.innerHTML = currentFlag;
        selectedItem.setAttribute("data-lang", currentLang);

        // Mettre à jour la langue
        const newLang = languageButton.getAttribute("data-lang");
        localStorage.setItem('preferredLanguage', newLang);
        loadLanguages(newLang);
        updatePlaceholders(newLang);
    }

    // Écouter les clics sur les options du menu déroulant
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            switchFlag(item);
        });
    });
});

