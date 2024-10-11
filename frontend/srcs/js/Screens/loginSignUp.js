// frontend/srcs/js/Screens/loginSignUp.js

// import { loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

export function initializeLogin() {
        const loginForm = document.querySelector("form.login");
        const loginBtn = document.querySelector("label.login");
        const signupBtn = document.querySelector("label.signup");
        const signupLink = document.getElementById("signup-link");
        const togglePasswordIcons = document.querySelectorAll(".toggle-password-icon");
        const loginSubmitButton = document.querySelector("form.login button[type='submit']");
        // const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        // loadLanguages(storedLang);
        // updatePlaceholders(storedLang);

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
      
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight')
                signupBtn.click();
            else if (event.key === 'ArrowLeft')
                loginBtn.click();
        });

        loginSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.history.pushState({}, "", "/home");
            handleLocation();
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
