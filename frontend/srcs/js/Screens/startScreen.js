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

    // Charger la langue stockée
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);
    updatePlaceholders(storedLang);

    document.getElementById("lang-switcher").addEventListener("change", (event) => {
        const selectedLang = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLang);
        loadLanguages(selectedLang);
        updatePlaceholders(selectedLang);
    });

});
