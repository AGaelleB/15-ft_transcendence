// frontend/srcs/js/Modals/alertModal.js

let alertModalLoaded = false;

export function initializeAlertModal() {
    if (!alertModalLoaded) {
        const modalHtml = `
            <div id="alertModal" class="alert-modal hidden">
                <div class="alert-modal-content">
                    <h2 class="message-alert">
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
        console.warn("Error loading translations:", error);
    }

    const modal = document.getElementById('alertModal');
    const messageContent = document.querySelector('.message-alert-content');

    let errorDetail = translations.errorDetails?.unknown || "Unknown error";
    if (additionalData) {
        errorDetail = Object.entries(additionalData)
            .map(([key, value]) => {
                const translatedMessage = translations.errorDetails[key] || value;
                return translatedMessage;
            })
            .join(", ");
    }

    switch (messageId) {
        case "emailUse":
            messageContent.textContent = translations["emailUse"] || "This email address is already in use, please choose another";
            break;
        case "invalidPassword":
            messageContent.textContent = translations["invalidPassword"] || "The password is invalid, please check and try again";
            break;
        case "emptyField":
            messageContent.textContent = translations["emptyField"] || "All fields must be filled";
            break;
        case "profileUpdateFailed":
            messageContent.textContent = `${translations["profileUpdateFailed"] || "Profile update failed:"} ${errorDetail}`;
            break;
        case "noUserLoggedIn":
            messageContent.textContent = translations["noUserLoggedIn"] || "No user is currently logged in";
            break;
        case "fillFields":
            messageContent.textContent = translations["fillFields"] || "Please fill in both fields";
            break;
        case "loginFailed":
            messageContent.textContent = `${translations["loginFailed"] || "Login failed:"} ${errorDetail}`;
            break;
        case "passwordsNotMatch":
            messageContent.textContent = translations["passwordsNotMatch"] || "Passwords do not match";
            break;
        case "signupFailed":
            messageContent.textContent = `${translations["signupFailed"] || "Signup failed:"} ${errorDetail}`;
            break;
        case "invalidNameTournament":
            messageContent.textContent = translations["invalidNameTournament"] || "Player names must be unique";
            break;
        case "2faAlert":
            messageContent.textContent = translations["2faAlert"] || "Please enter a valid 6-digit code";
            break;
        case "2faResend":
            messageContent.textContent = translations["2faResend"] || "OTP resent successfully to your email";
            break;
        default:
            messageContent.textContent = translations["defaultError"] || "An error occurred. Please try again.";
    }

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('closeAlert');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}