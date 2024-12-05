// frontend/srcs/js/Screens/loginSignUp.js

import { myAlert } from '../Modals/alertModal.js';
import { isEmailAvailable } from '../Modals/dashboardModal.js';
import { loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

export async function initializeLogin() {
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
        console.log("username :", username);
        console.log("password :", password);

        try {
            const response = await fetch('http://127.0.0.1:8001/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(loginData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log("errorData :", errorData);
                await myAlert("loginFailed", errorData);
            }
            else {
                const userResponse = await response.json();
                console.log("reponse :", userResponse);
                localStorage.setItem('user', JSON.stringify({
                    id: userResponse.id,
                    username: userResponse.username,
                    email: userResponse.email,
                    is_2fa: userResponse.is_2fa,
                }));
                window.history.pushState({}, "", "/home");
                handleLocation();
            }
        }
        catch (error) {
            console.warn('Error during login:', error);
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
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (password !== confirmPassword) {
        await myAlert("passwordsNotMatch");
        return;
    }

    const isEmailAvailableForSave = await isEmailAvailable(email);
    if (!isEmailAvailableForSave) {
        await myAlert("emailUse");
        return;
    }

    const userData = {
        "username": username,
        "email": email,
        "is_2fa": false,
        "password": password,
    };

    try {
        const response = await fetch('http://127.0.0.1:8001/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            // Si la réponse n'est pas ok, on traite l'erreur ici sans loguer dans la console
            const errorData = await response.json();
            console.log(errorData);
            await myAlert("signupFailed", errorData);
        } else {
            // Si la requête est un succès
            const userResponse = await response.json();

            localStorage.setItem('user', JSON.stringify({
                id: userResponse.id,
                username: userResponse.username,
                email: userResponse.email,
                is_2fa: userResponse.is_2fa,
                profileImageUrl: '/srcs/images/icons/loginIcon3.png',
            }));
            window.history.pushState({}, "", "/home");
            handleLocation();
        }
    }
    catch (error) {
        // En cas d'erreur réseau ou d'erreurs non liées à HTTP, on ignore l'affichage d'erreur
        // ou on peut loguer l'erreur discrètement si nécessaire sans afficher dans la console
    }
});
