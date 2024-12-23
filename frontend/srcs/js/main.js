// frontend/srcs/js/main.js

const routes = {
    404: "./templates/404.html",
    "/": "./templates/startScreen.html",
    "/start": "./templates/startScreen.html",
    "/home": "./templates/homeScreen.html",
    "/login": "./templates/loginSignUp.html",
    "/profil": "./templates/userDashboard.html",
    "/1player-2d": "./templates/1Player2D.html",
    "/1player-3d": "./templates/1Player3D.html",
    "/2players-2d": "./templates/2Players2D.html",
    "/2players-3d": "./templates/2Players3D.html",
    "/tournament-2d": "./templates/tournament2D.html",
    "/tournament-3d": "./templates/tournament3D.html",
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const isUserLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user;
};

const isUserLoggedIn2 = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        if (window.location.pathname !== '/login') {
            window.history.pushState({}, "", '/login');
            handleLocation();
        }
        return false;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8001/users/${user.username}/`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            if (window.location.pathname !== '/home') {
                window.history.pushState({}, "", '/home');
                handleLocation();
            }
            return true;
        }
        else {
            if (window.location.pathname !== '/login') {
                window.history.pushState({}, "", '/login');
                handleLocation();
            }
            return false;
        }
    }
    catch (error) {
        console.error("Error verifying user login:", error);
        if (window.location.pathname !== '/login') {
            window.history.pushState({}, "", '/login');
            handleLocation();
        }
        return false;
    }
};

const handleLocation = async () => {
    let path = window.location.pathname;
    if (path.includes("/frontend/srcs/"))
        path = path.replace("/frontend/srcs", "");

    const publicRoutes = ['/login', '/start', '/index.html', '/'];
    if (!isUserLoggedIn() && !publicRoutes.includes(path))
        path = '/404'

    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("app").innerHTML = html;

    if (path === '/404') {
        const homeIcon404 = document.getElementById("homeIcon404");
        if (homeIcon404) {
            homeIcon404.addEventListener("click", () => {
                window.history.pushState({}, "", "/start");
                handleLocation();
            });
        }
    }

    switch (path) {
        case '/start':
            import('./Screens/startScreen.js')
                .then(module => module.initializeStartScreen())
                .catch(err => console.error('Failed to load startScreen.js:', err));
            break;

            
        case '/login':
            const loggedIn = await isUserLoggedIn2();
            if (loggedIn)
                return;
            import('./Screens/loginSignUp.js')
                .then(module => {
                    module.initializeLogin();
                    const hash = window.location.hash;
                    if (hash === "#signup")
                        document.querySelector("label.signup").click();
                    else
                        document.querySelector("label.login").click();
                })
                .catch(err => console.error('Failed to load loginSignUp.js:', err));
            break;
        
        case '/index.html':
            import('./Screens/startScreen.js')
                .then(module => {
                    module.initializeStartScreen();
                })
                .catch(err => console.error('Failed to load startScreen.js:', err));
            break;

        case '/home':
            import('./Screens/homeScreen.js')
                .then(module => module.initializeHome())
                .catch(err => console.error('Failed to load homeScreen.js:', err));
            break;

        case '/profil':
            import('./Screens/userDashboard.js')
                .then(module => module.initializeProfil())
                .catch(err => console.error('Failed to load userDashboard.js:', err));
            break;

        case '/1player-2d':
            import('./Screens/1Player2D.js')
                .then(module => module.initialize1Player2D())
                .catch(err => console.error('Failed to load 1Player2D.js:', err));
            break;

        case '/1player-3d':
            import('./Screens/1Player3D.js')
                .then(module => module.initialize1Player3D())
                .catch(err => console.error('Failed to load 1Player3D.js:', err));
            break;

        case '/2players-2d':
            import('./Screens/2Players2D.js')
                .then(module => module.initialize2Players2D())
                .catch(err => console.error('Failed to load 2Players2D.js:', err));
            break;

        case '/2players-3d':
            import('./Screens/2Players3D.js')
                .then(module => module.initialize2Players3D())
                .catch(err => console.error('Failed to load 2Players3D.js:', err));
            break;

        case '/tournament-2d':
            import('./Screens/tournament2D.js')
                .then(module => module.initializeTournament2D())
                .catch(err => console.error('Failed to load tournament2D.js:', err));
            break;

        case '/tournament-3d':
            import('./Screens/tournament3D.js')
                .then(module => module.initializeTournament3D())
                .catch(err => console.error('Failed to load tournament3D.js:', err));
            break;

        default:
            break;
    }
};

window.onpopstate = handleLocation;

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === "/") {
        window.history.pushState({}, "", "/start");
    }
    handleLocation();
});
