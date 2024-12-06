// frontend/srcs/js/Screens/loginSignUp.js

import { myAlert } from '../Modals/alertModal.js';
import { isEmailAvailable } from '../Modals/dashboardModal.js';
import { loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

export async function initializeLogin() {
    console.log("Debug step:", localStorage.getItem("debugStep"));
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    try {
        const translations = await loadLanguages(storedLang);
        updatePlaceholders(translations);
    }
    catch (error) {
        console.error("Error initializing app:", error);
    }

    const loginForm = document.querySelector("form.login");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.getElementById("signup-link");
    const togglePasswordIcons = document.querySelectorAll(".toggle-password-icon");
    const loginSubmitButton = document.querySelector("form.login button[type='submit']");

    signupLink.addEventListener("click", (event) => {
        event.preventDefault();
        signupBtn.click();
    });
      
    signupBtn.onclick = () => {
        loginForm.style.marginLeft = "-50%";
    };
  
    loginBtn.onclick = () => {
        loginForm.style.marginLeft = "0%";
    };
    
    function switchFormBasedOnHash() {
        const hash = window.location.hash;
        if (hash === "#signup")
            signupBtn.click();
        else
            loginBtn.click();
    }
      
    switchFormBasedOnHash();
    
    window.addEventListener('hashchange', switchFormBasedOnHash);

    loginSubmitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password-input").value;
        if (!username) {
            await myAlert("fillFields");
            return;
        }

        const loginData = {
            "username": username,
            "password": password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8001/login/', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Login failed:", errorData);
                await myAlert("loginFailed", errorData);
                return;
            }
        
            const userResponse = await response.json();
            console.log("Login response:", userResponse);
        
            // Récupérer les détails de l'utilisateur
            try {
                const response_log = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
        
                if (response_log.ok) {
                    const userData = await response_log.json();
                    console.log("User data:", userData);
        
                    // Sauvegarde des données utilisateur dans localStorage
                    localStorage.setItem('user', JSON.stringify({
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        is_2fa: userData.is_2fa,
                    }));
        
                    // Redirection vers /home
                    window.history.pushState({}, "", "/home");
                    handleLocation();
                }
                else {
                    const errorData_log = await response_log.json();
                    console.warn("Failed to fetch user data:", errorData_log);
                }
            }
            catch (error) {
                console.warn("Error during user data fetch:", error);
            }
        }
        catch (error) {
            console.warn("Error during login:", error);
        }
    });
    
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            const passwordInput = this.parentElement.previousElementSibling;
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("bi-eye");
            this.classList.toggle("bi-eye-slash");
        });
    });
}

document.querySelector("form.signup").addEventListener("submit", async function(event) {
    console.log("Form submission intercepted"); // Ajouter pour déboguer
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (password !== confirmPassword) {
        await myAlert("passwordsNotMatch");
        return;
    }

    // const isEmailAvailableForSave = await isEmailAvailable(email);
    // if (!isEmailAvailableForSave) {
    //     await myAlert("emailUse");
    //     return;
    // }

    const userData = {
        "username": username,
        "email": email,
        "is_2fa": false,
        "password": password,
    };

    try {
        const response = await fetch('http://127.0.0.1:8001/users/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            await myAlert("signupFailed", errorData);
        }
        else {
            const userResponse = await response.json();

            localStorage.setItem('user', JSON.stringify({
                id: userResponse.id,
                username: userResponse.username,
                email: userResponse.email,
                is_2fa: userResponse.is_2fa,
                profileImageUrl: '/srcs/images/icons/loginIcon3.png',
            }));

            const loginData = {
                "username": username,
                "password": password,
            };

            try {
                const response = await fetch('http://127.0.0.1:8001/login/', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Login failed:", errorData);
                    await myAlert("loginFailed", errorData);
                    return;
                }


                const userResponse = await response.json();
                console.log("Login response:", userResponse);
            
                try {
                    const response_log = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });

                    if (response_log.ok) {
                        const userData = await response_log.json();
                        console.log("User data:", userData);
            
                        localStorage.setItem('user', JSON.stringify({
                            id: userData.id,
                            username: userData.username,
                            email: userData.email,
                            is_2fa: userData.is_2fa,
                        }));
            
                        console.log("Redirecting to /home");
                        window.history.pushState({}, "", "/home");
                        handleLocation();
                    }
                    else {
                        const errorData_log = await response_log.json();
                        console.warn("Failed to fetch user data:", errorData_log);
                    }
                }
                catch (error) {
                    console.warn("Error during user data fetch:", error);
                }
            }
            catch (error) {
                console.warn("Error during login:", error);
            }
        }
    }
    catch (error) {
        // En cas d'erreur réseau ou d'erreurs non liées à HTTP, on ignore l'affichage d'erreur
        // ou on peut loguer l'erreur discrètement si nécessaire sans afficher dans la console
    }
});
