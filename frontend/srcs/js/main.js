const routes = {
    404: "/frontend/srcs/templates/404.html",
    "/": "/frontend/srcs/templates/startScreen.html",
    "/start": "/frontend/srcs/templates/startScreen.html",
    "/index.html": "/frontend/srcs/templates/startScreen.html",
    "/home": "/frontend/srcs/templates/homeScreen.html",
    "/login": "/frontend/srcs/templates/loginSignUp.html",
    "/profil": "/frontend/srcs/templates/userDashboard.html",
    "/1player-2d": "/frontend/srcs/templates/1Player2D.html",
    "/1player-3d": "/frontend/srcs/templates/1Player3D.html",
    "/2players-2d": "/frontend/srcs/templates/2Players2D.html",
    "/2players-3d": "/frontend/srcs/templates/2Players3D.html",
    "/multi-2d": "/frontend/srcs/templates/multiPlayers2D.html",
    "/multi-3d": "/frontend/srcs/templates/multiPlayers3D.html"
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const handleLocation = async () => {
    let path = window.location.pathname;

    if (path.includes("/frontend/srcs/"))
        path = path.replace("/frontend/srcs", "");

    if (path === "/" || path === "")
        path = "/start";


    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("app").innerHTML = html;

    console.log("Path: ", path);
    switch (path) {
        case '/start':
            console.log("Start screen loaded");
            import('./Screens/startScreen.js')
                .then(module => {
                    module.initializeStartScreen();
                })
                .catch(err => console.error('Failed to load startScreen.js:', err));
            break;

        case '/index.html':
            console.log("Start screen loaded");
            import('./Screens/startScreen.js')
                .then(module => {
                    module.initializeStartScreen();
                })
                .catch(err => console.error('Failed to load startScreen.js:', err));
            break;

        case '/login':
            console.log("Login page loaded");
            import('./Screens/loginSignUp.js')
            .then(module => {
                module.initializeLogin();
            })
            .catch(err => console.error('Failed to load loginSignUp.js:', err));
            break;

        case '/home':
            console.log("Home page loaded");
            import('./Screens/homeScreen.js')
            .then(module => {
                module.initializeHome();
            })
            .catch(err => console.error('Failed to load homeScreen.js:', err));
            break;

        case '/profil':
            console.log("Profile page loaded");
            import('./Screens/userDashboard.js')
            .then(module => {
                module.initializeProfil();
            })
            .catch(err => console.error('Failed to load userDashboard.js:', err));
            break;

        case '/1player-2d':
            console.log("1 Player 2D game loaded");
            import('./Screens/1Player2D.js')
            .then(module => {
                module.initialize1Player2D();
            })
            .catch(err => console.error('Failed to load 1Player2D.js:', err));
            break;

        case '/1player-3d':
            console.log("1 Player 3D game loaded");
            import('./PongGame/Game3D/draw3D.js')
            import('./Screens/1Player3D.js')
            .then(module => {
                module.initialize1Player3D();
            })
            .catch(err => console.error('Failed to load 1Player3D.js:', err));
            break;

        case '/2players-2d':
            console.log("2 Players 2D game loaded");
            import('./Screens/2Players2D.js')
            .then(module => {
                module.initialize2Players2D();
            })
            .catch(err => console.error('Failed to load 2Players2D.js:', err));
            break;

        case '/2players-3d':
            console.log("2 Players 3D game loaded");
            import('./Screens/2Players3D.js')
            .then(module => {
                module.initialize2Players3D();
            })
            .catch(err => console.error('Failed to load 2Players3D.js:', err));
            break;

        default:
            console.log("404 Page not found");
            break;
    }
};

// détecte les changements de route
window.onpopstate = handleLocation;

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === "/") {
        window.history.pushState({}, "", "/start");
    }
    handleLocation();
});


