// frontend/srcs/js/Screens/startScreen.js

import { loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

export function initializeStartScreen() {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/login");
        route(event);  // Utilisation de la fonction route pour gérer la navigation
    });
    
    signupButton.addEventListener("click", function(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/login"); // Ou "/register" selon la structure
        route(event);  // Utilisation de la fonction route pour gérer la navigation
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

    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);
    updatePlaceholders(storedLang);

    function switchFlag(selectedItem) {
        const currentFlag = languageButton.innerHTML;
        const currentLang = languageButton.getAttribute("data-lang");

        languageButton.innerHTML = selectedItem.innerHTML;
        languageButton.setAttribute("data-lang", selectedItem.getAttribute("data-lang"));

        selectedItem.innerHTML = currentFlag;
        selectedItem.setAttribute("data-lang", currentLang);

        const newLang = languageButton.getAttribute("data-lang");
        localStorage.setItem('preferredLanguage', newLang);
        loadLanguages(newLang);
        updatePlaceholders(newLang);
    }

    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            switchFlag(item);
        });
    });
}
