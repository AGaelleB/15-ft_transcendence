// frontend/srcs/js/Modals/alertModal.js

let alertModalLoaded = false;

export function initializeAlertModal() {
    if (!alertModalLoaded) {
        const modalHtml = `
            <div id="alertModal" class="alert-modal hidden">
                <div class="alert-modal-content">
                    <h2 class="message-alert" data-lang-key="alertMessage">Alert Message</h2>
                    <p class="message-alert-content">texte</p>
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

export function myAlert(messageId) {
    initializeAlertModal();

    const modal = document.getElementById('alertModal');
    const messageContent = document.querySelector('.message-alert-content');

    switch (messageId) {
        case "emailUse":
            messageContent.textContent = "Cette adresse e-mail est déjà utilisée, veuillez en choisir une autre.";
            break;
        case "invalidPassword":
            messageContent.textContent = "Le mot de passe est invalide, veuillez vérifier et réessayer.";
            break;
        case "emptyField":
            messageContent.textContent = "Tous les champs doivent être remplis.";
            break;
        default:
            messageContent.textContent = "Une erreur est survenue. Veuillez réessayer.";
    }

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('closeAlert');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}
