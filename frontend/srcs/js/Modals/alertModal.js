// frontend/srcs/js/Modals/alertModal.js

async function loadAlertModal() {
    if (!document.getElementById('alert-modal')) {
        const response = await fetch('/frontend/srcs/templates/alertModal.html');
        const modalHtml = await response.text();
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    }
}

export async function myAlert(messageId) {
    await loadAlertModal();

    const modal = document.getElementById('alert-modal');
    const messageContent = document.querySelector('.message-alert-content');

    // Vérifie que les éléments existent
    if (!modal || !messageContent) {
        console.error("Modal or message content element not found.");
        return;
    }

    // Définit les messages pour chaque identifiant
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

    // Affiche le modal
    modal.classList.remove('hidden');

    // Gestion de la fermeture du modal
    const closeBtn = document.getElementById('closeAlert');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}
