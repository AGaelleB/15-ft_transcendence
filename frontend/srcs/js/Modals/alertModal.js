// frontend/srcs/js/Modals/alertModal.js

let alertModalLoaded = false;

export function initializeAlertModal() {
    if (!alertModalLoaded) {
        const modalHtml = `
            <div id="alertModal" class="alert-modal hidden">
                <div class="alert-modal-content">
                    <h2 class="message-alert">
                        <i class="bi bi-megaphone-fill siren-icon"></i>
                        <span data-lang-key="alertMessage">Alert Message</span>
                        <i class="bi bi-megaphone-fill siren-icon"></i>
                    </h2>
                    <p class="message-alert-content" data-lang-key="alertContent">texte</p>
                    <div class="ok-btn">
                        <button id="closeAlert" class="close-alert-btn" data-lang-key="okButton">OK</button>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
        alertModalLoaded = true;
    }
}


export async function myAlert(messageId, additionalData) {
    initializeAlertModal();

    let translations = {};
    try {
        const { loadLanguages } = await import('./switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    const modal = document.getElementById('alertModal');
    const messageContent = document.querySelector('.message-alert-content');

    switch (messageId) {
        case "emailUse":
            messageContent.textContent = translations["emailUse"] || "Default message for emailUse.";
            break;
        case "invalidPassword":
            messageContent.textContent = translations["invalidPassword"] || "Default message for invalidPassword.";
            break;
        case "emptyField":
            messageContent.textContent = translations["emptyField"] || "Default message for emptyField.";
            break;
        case "profileUpdateFailed":
            messageContent.textContent = translations["profileUpdateFailed"] || 
                "Profile update failed: " + (additionalData ? JSON.stringify(additionalData) : "Unknown error.");
            break;
        case "noUserLoggedIn":
            messageContent.textContent = translations["noUserLoggedIn"] || "No user is currently logged in.";
            break;
        case "fillFields":
            messageContent.textContent = translations["fillFields"] || "Please fill in both fields";
            break;
        case "loginFailed":
            messageContent.textContent = translations["loginFailed"] || 
                "Login failed: " + (additionalData ? JSON.stringify(additionalData) : "Unknown error");
            break;
        case "passwordsNotMatch":
            messageContent.textContent = translations["passwordsNotMatch"] || "Passwords do not match";
            break;
        case "signupFailed":
            messageContent.textContent = translations["signupFailed"] || 
                "Signup failed: " + (additionalData ? JSON.stringify(additionalData) : "Unknown error");
            break;
        default:
            messageContent.textContent = translations["defaultError"] || "Default error message.";
    }

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('closeAlert');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}
