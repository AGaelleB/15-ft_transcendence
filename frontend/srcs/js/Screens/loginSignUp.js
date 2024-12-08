// frontend/srcs/js/Screens/loginSignUp.js

import { myAlert } from '../Modals/alertModal.js';
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
    const signupForm = document.querySelector("form.signup");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.getElementById("signup-link");

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
    window.addEventListener('hashchange', (event) => {
        event.preventDefault();
        switchFormBasedOnHash();
    });

    loginForm.addEventListener("submit", handleLogin);
    signupForm.addEventListener("submit", handleSignup);
}

async function handleLogin(event, loginData = null) {
    event?.preventDefault();

    const username = loginData?.username || document.getElementById("login-username").value;
    const password = loginData?.password || document.getElementById("login-password-input").value;

    if (!username || !password) {
        console.error("Login error: Missing username or password.");
        await myAlert("fillFields");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8001/login/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Login failed with details:", errorData);
            await myAlert("loginFailed", errorData);
            return;
        }

        const userResponse = await response.json();
        console.log("Login response:", userResponse);

        localStorage.setItem('user', JSON.stringify({
            id: userResponse.id,
            username,
        }));

        window.history.pushState({}, "", "/home");
        handleLocation();
    }
    catch (error) {
        console.error("Error during login:", error);
    }
}

async function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (password !== confirmPassword) {
        console.error("Signup error: Passwords do not match.");
        await myAlert("passwordsNotMatch");
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
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Signup failed with details:", errorData);

            Object.entries(errorData).forEach(([field, error]) => {
                console.error(`Field '${field}' error: ${error}`);
            });

            await myAlert("signupFailed", errorData);
            return;
        }

        const userResponse = await response.json();
        console.log("Signup response:", userResponse);

        await handleLogin(null, { username, password });

        localStorage.setItem('user', JSON.stringify({
            id: userResponse.id,
            username: userResponse.username,
            email: userResponse.email,
            is_2fa: userResponse.is_2fa,
        }));
    }
    catch (error) {
        console.error("Error during signup:", error);
    }
}
