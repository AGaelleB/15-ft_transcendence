const routes = {
    404: "../templates/404.html",
    "/": "../templates/homeScreen.html",
    "/start": "../templates/startScreen.html",
    "/home": "../templates/homeScreen.html",
    "/login": "../templates/loginSignUp.html",
    "/profile": "../templates/userDashboard.html",
    "/1player-2d": "../templates/1Player2D.html",
    "/1player-3d": "../templates/1Player3D.html",
    "/2players-2d": "../templates/2Players2D.html",
    "/2players-3d": "../templates/2Players3D.html",
    "/multi-2d": "../templates/multiPlayers2D.html",
    "/multi-3d": "../templates/multiPlayers3D.html"
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const handleLocation = async () => {
    let path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("app").innerHTML = html;

    // Gestion des cas en fonction de la route actuelle
    switch (path) {
        case '/home':
            console.log("Home page loaded");
            // Appeler ici les scripts spécifiques à la page homeScreen.html
            break;

        case '/start':
            console.log("Start screen loaded");
            // Appeler ici les scripts spécifiques à la page startScreen.html
            break;

        case '/login':
            console.log("Login page loaded");
            // Appeler ici les scripts spécifiques à la page loginSignUp.html
            break;

        case '/profile':
            console.log("Profile page loaded");
            // Appeler ici les scripts spécifiques à la page userDashboard.html
            break;

        case '/1player-2d':
            console.log("1 Player 2D game loaded");
            // Appeler ici les scripts spécifiques à la page 1Player2D.html
            break;

        case '/1player-3d':
            console.log("1 Player 3D game loaded");
            // Appeler ici les scripts spécifiques à la page 1Player3D.html
            break;

        case '/2players-2d':
            console.log("2 Players 2D game loaded");
            // Appeler ici les scripts spécifiques à la page 2Players2D.html
            break;

        case '/2players-3d':
            console.log("2 Players 3D game loaded");
            // Appeler ici les scripts spécifiques à la page 2Players3D.html
            break;

        case '/multi-2d':
            console.log("Multiplayer 2D game loaded");
            // Appeler ici les scripts spécifiques à la page multiPlayers2D.html
            break;

        case '/multi-3d':
            console.log("Multiplayer 3D game loaded");
            // Appeler ici les scripts spécifiques à la page multiPlayers3D.html
            break;

        default:
            console.log("404 Page not found");
            // Si c'est une route qui ne correspond à rien, le contenu de 404 est déjà chargé
            break;
    }
};

// Ecouteur d'événements pour détecter les changements de route
window.onpopstate = handleLocation;

// Charger la page actuelle lors du chargement initial
window.addEventListener('DOMContentLoaded', () => {
    handleLocation();
});
