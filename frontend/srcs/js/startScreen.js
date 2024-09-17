document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    let keyboardNavigationEnabled = true; // Indicateur pour activer ou désactiver la navigation clavier

    // Fonction pour désactiver le focus
    function clearFocus() {
        loginButton.blur();
        signupButton.blur();
    }

    // Empêcher le focus par défaut au chargement
    clearFocus();

    // Gestion des flèches pour naviguer entre les boutons
    document.addEventListener('keydown', (event) => {
        // Ne réagit qu'aux touches si la navigation au clavier est activée
        if (!keyboardNavigationEnabled) return;

        if (event.key === 'ArrowRight') {
            if (document.activeElement !== signupButton) {
                signupButton.focus();
                event.preventDefault();
            }
        } else if (event.key === 'ArrowLeft') {
            if (document.activeElement !== loginButton) {
                loginButton.focus();
                event.preventDefault();
            }
        }
    });

    // Gestion du survol de la souris pour désactiver la navigation clavier
    loginButton.addEventListener('mouseenter', () => {
        keyboardNavigationEnabled = false; // Désactive la navigation clavier
        loginButton.focus();
        signupButton.blur();
    });

    signupButton.addEventListener('mouseenter', () => {
        keyboardNavigationEnabled = false; // Désactive la navigation clavier
        signupButton.focus();
        loginButton.blur();
    });

    // Réactive la navigation clavier lorsqu'on quitte les boutons avec la souris
    loginButton.addEventListener('mouseleave', () => {
        clearFocus();
        keyboardNavigationEnabled = true; // Réactive la navigation clavier
    });

    signupButton.addEventListener('mouseleave', () => {
        clearFocus();
        keyboardNavigationEnabled = true; // Réactive la navigation clavier
    });
});

