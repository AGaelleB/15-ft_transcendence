menuItems.forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
        keyboardNavigationEnabled = false;
        currentIndex = index;
        updateSelection();
    });

    item.addEventListener('mouseleave', function() {
        keyboardNavigationEnabled = true;
    });

    item.addEventListener('click', function(event) {
        event.preventDefault();

        const mode = item.innerText.trim();  // "1 PLAYER", "2 PLAYERS", "MULTI PLAYERS"
        localStorage.setItem('gameMode', mode);

        const targetPath = getTargetPath(mode); // Fonction qui retourne la route cible en fonction du mode
        window.history.pushState({}, "", targetPath);

        // Appeler handleLocation pour gérer la navigation sans rechargement
        handleLocation();
    });
});