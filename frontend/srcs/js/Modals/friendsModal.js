// frontend/srcs/js/Modals/friendsModal.js

export function openFriendsModal() {
    const homeIcon = document.getElementById('homeIcon');
    homeIcon.classList.add('hidden');
    const modal = document.getElementById("friendsModal");
    modal.classList.remove("hidden");
    loadFriendsModalContent("friends");
}

export function closeFriendsModal() {
    const modal = document.getElementById("friendsModal");
    modal.classList.add("hidden");
    homeIcon.classList.remove('hidden');
}

export function initializeFriendsModalEvents() {
    const friendsModal = document.getElementById("friendsModal");
    const closeProfileButtonFriends = friendsModal.querySelector(".close-button-friends");

    if (closeProfileButtonFriends) {
        closeProfileButtonFriends.addEventListener("click", closeFriendsModal);
    }
    else {
        console.error("Le bouton de fermeture du modal n'a pas été trouvé.");
    }

    // Attacher les événements de changement aux boutons radio
    const radioButtons = document.querySelectorAll('input[name="friendsOptions"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            loadFriendsModalContent(radio.id); // Passe l'ID du bouton sélectionné
        });
    });
}

async function fetchUserDetails(username) {
    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <mettre_le_token_d_authentification>',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }
        const userDetails = await response.json();
        return userDetails;
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}

function getAvatarUrl(username) {
    return `http://127.0.0.1:8001/users/${username}/avatar/`;
}

// Fonction pour obtenir tous les utilisateurs (à adapter selon votre API)
async function fetchAllUsers() {
    try {
        const response = await fetch("http://127.0.0.1:8001/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.ok ? await response.json() : [];
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Fonction pour envoyer une demande d'ami
async function sendFriendRequest(receiverId) {
    // Récupère les informations de l'utilisateur connecté depuis le localStorage
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        console.error("User not logged in");
        return;
    }

    const currentUser = JSON.parse(savedUser);

    try {
        const response = await fetch("http://127.0.0.1:8001/friend-request/create/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <your_auth_token>', // Remplacez <your_auth_token> par votre token d'authentification si nécessaire
            },
            body: JSON.stringify({
                sender: currentUser.id, // ID de l'utilisateur connecté
                receiver: receiverId    // ID de l'utilisateur que l'on veut ajouter en ami
            })
        });

        if (!response.ok) {
            throw new Error("Failed to send friend request");
        }
    }
    catch (error) {
        console.error("Error sending friend request:", error);
    }
}

// Fonction pour récupérer toutes les demandes d'amis
async function fetchAllFriendRequests() {
    try {
        const response = await fetch("http://127.0.0.1:8001/friend-request/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez l'autorisation si nécessaire, par exemple:
                // 'Authorization': 'Bearer <votre_token>'
            }
        });

        if (!response.ok) {
            throw new Error("Échec de la récupération des demandes d'amis");
        }

        const friendRequests = await response.json();
        return friendRequests;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des demandes d'amis :", error);
        return [];
    }
}

// Fonction pour afficher les invitations en attente dans l'onglet "Invitations en attente"
export async function loadPendingInvitations() {
    const contentContainer = document.getElementById("friendsModalContent");
    contentContainer.innerHTML = ""; // Vide le contenu précédent

    const currentUser = JSON.parse(localStorage.getItem("user"));

    // translations
    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    // Récupère toutes les demandes d'amis
    const friendRequests = await fetchAllFriendRequests();

    // Filtre les demandes pour celles où l'utilisateur actuel est le destinataire
    const pendingInvites = friendRequests.filter(request => request.receiver.id === currentUser.id);

    if (pendingInvites.length > 0) {
        pendingInvites.forEach(invite => {
            const inviteRow = document.createElement("div");
            inviteRow.classList.add("user-row");

            const inviteInfo = document.createElement("div");
            inviteInfo.classList.add("user-info");

            // Avatar de l'expéditeur
            const avatar = document.createElement("img");
            avatar.src = getAvatarUrl(invite.sender.username);
            avatar.alt = `${invite.sender.username}'s avatar`;
            avatar.classList.add("user-avatar");

            // Nom d'utilisateur de l'expéditeur
            const username = document.createElement("p");
            username.textContent = invite.sender.username;
            username.classList.add("user-name");

            inviteInfo.appendChild(avatar);
            inviteInfo.appendChild(username);

            // Bouton d'acceptation (coche verte)
            const acceptButton = document.createElement("i");
            acceptButton.classList.add("bi", "bi-check-square-fill", "accept-button");
            acceptButton.style.color = "green";
            acceptButton.style.cursor = "pointer";
            acceptButton.addEventListener("click", () => {
                handleFriendRequestAction(invite.id, "accept");
            });

            // Bouton de refus (croix rouge)
            const declineButton = document.createElement("i");
            declineButton.classList.add("bi", "bi-x-square-fill", "decline-button");
            declineButton.style.color = "red";
            declineButton.style.cursor = "pointer";
            declineButton.addEventListener("click", () => {
                handleFriendRequestAction(invite.id, "decline");
            });

            inviteRow.appendChild(inviteInfo);
            inviteRow.appendChild(acceptButton);
            inviteRow.appendChild(declineButton);

            contentContainer.appendChild(inviteRow);
        });
    }
    else {
        contentContainer.innerHTML = `<p>${translations.noInvitationPending}</p>`;
    }
}

async function handleFriendRequestAction(requestId, action) {
    try {
        const response = await fetch(`http://127.0.0.1:8001/friend-request/${requestId}/${action}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // Incluez un jeton d'autorisation si nécessaire :
                // 'Authorization': 'Bearer <votre_token>'
            }
        });

        if (response.ok) {
            loadPendingInvitations();
        }
        else {
            console.error(`Échec de la demande ${action}`);
        }
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour de la demande d'ami :", error);
    }
}

function updateFriendButtonStatus(button, status) {
    button.classList.remove("bi-person-add", "bi-person-plus", "bi-person-check"); // Reset classes
    button.style.cursor = "pointer"; // Reset cursor
    button.style.pointerEvents = "auto"; // Réactive les clics par défaut

    if (status === "pending") {
        button.classList.add("bi-person-plus"); // Icone d'attente
        button.style.color = "orange";
        button.style.pointerEvents = "none"; // Empêche complètement les clics
    }
    else if (status === "accepted") {
        button.classList.add("bi-person-check"); // Icon pour les amis
        button.style.color = "gray";
        button.style.pointerEvents = "none"; // Empêche les clics pour les amis aussi
    }
    else {
        button.classList.add("bi-person-add"); // Icon pour ajouter un ami
        button.style.color = "green";
        button.style.pointerEvents = "auto"; // Active les clics uniquement pour ajouter
    }
}

async function handleFriendRequest(userId, button) {
    try {
        await sendFriendRequest(userId);
        updateFriendButtonStatus(button, "pending");
        console.log("Demande d'ami envoyée.");
    }
    catch (error) {
        console.error("Erreur lors de l'envoi de la demande d'ami:", error);
    }
}

const requestButton = document.createElement("i");
requestButton.classList.add("bi", "bi-person-add", "request-button");
requestButton.style.color = "green";
requestButton.style.cursor = "pointer";
requestButton.addEventListener("click", () => {
    handleFriendRequest(user.id, requestButton);
});

async function checkPendingRequest(userId) {
    const friendRequests = await fetchAllFriendRequests();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Vérifie si une demande d'ami est en attente entre l'utilisateur actuel et le `userId`
    return friendRequests.some(request => 
        (request.sender.id === currentUser.id && request.receiver.id === userId) ||
        (request.receiver.id === currentUser.id && request.sender.id === userId)
    );
}

/* =================== MAIN FUNCTION ==================== */

export async function loadFriendsModalContent(option) {
    const contentContainer = document.getElementById("friendsModalContent");
    contentContainer.innerHTML = "";

    // translations
    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    if (option === "friends") {
        const savedUser = localStorage.getItem('user');
        const username = savedUser ? JSON.parse(savedUser).username : null;
        const userDetails = username ? await fetchUserDetails(username) : null;

        if (userDetails && userDetails.friends.length > 0) {
            // Trier les amis par ordre alphabétique
            const sortedFriends = userDetails.friends.sort((a, b) => a.username.localeCompare(b.username));

            for (const friend of sortedFriends) {
                // Récupérer les détails complets de chaque ami pour obtenir `is_connected`
                const friendDetails = await fetchUserDetails(friend.username);

                const friendRow = document.createElement("div");
                friendRow.classList.add("user-row");

                const friendInfo = document.createElement("div");
                friendInfo.classList.add("user-info");

                const avatarContainer = document.createElement("div");
                avatarContainer.classList.add("avatar-container");

                const avatar = document.createElement("img");
                avatar.src = getAvatarUrl(friend.username);
                avatar.alt = `${friend.username}'s avatar`;
                avatar.classList.add("user-avatar");

                const statusDot = document.createElement("span");
                statusDot.classList.add("status-dot");
                
                // Utiliser `is_connected` du détail complet de l'ami
                statusDot.style.backgroundColor = friendDetails.is_connected ? "green" : "gray";
                
                avatarContainer.appendChild(avatar);
                avatarContainer.appendChild(statusDot);

                const usernameElement = document.createElement("p");
                usernameElement.textContent = friend.username;
                usernameElement.classList.add("user-name");

                friendInfo.appendChild(avatarContainer);
                friendInfo.appendChild(usernameElement);

                const showProfileButton = document.createElement("button");
                showProfileButton.textContent = translations.showProfileButton || "Show Profile";
                showProfileButton.classList.add("show-profile-button");
                showProfileButton.addEventListener("click", () => {
                    console.log(`Show profile of ${friend.username}`);
                });

                const profileArrow = document.createElement("i");
                profileArrow.classList.add("bi", "bi-arrow-right-circle-fill");
                profileArrow.style.color = "green";
                profileArrow.style.cursor = "pointer";
                profileArrow.addEventListener("click", () => {
                    console.log(`Redirect to profile of ${friend.username}`);
                });

                friendRow.appendChild(friendInfo);
                friendRow.appendChild(showProfileButton);
                friendRow.appendChild(profileArrow);

                contentContainer.appendChild(friendRow);
            }
        }
        else {
            contentContainer.innerHTML = `<p>${translations.noFriendsFound}</p>`;
        }
    }
    else if (option === "users") {
        const savedUser = localStorage.getItem('user');
        const currentUser = savedUser ? JSON.parse(savedUser).username : null;

        if (!currentUser) {
            console.error("Utilisateur non connecté.");
            return;
        }

        const currentUserDetails = await fetchUserDetails(currentUser);
        const friendsUsernames = currentUserDetails && currentUserDetails.friends ? currentUserDetails.friends.map(friend => friend.username) : [];

        const users = await fetchAllUsers();

        if (users && users.length > 0) {
            users.sort((a, b) => a.username.localeCompare(b.username));
            const filteredUsers = users.filter(user => user.id !== currentUserDetails.id);

            for (const user of filteredUsers) {
                const userRow = document.createElement("div");
                userRow.classList.add("user-row");

                const userInfo = document.createElement("div");
                userInfo.classList.add("user-info");

                const avatarContainer = document.createElement("div");
                avatarContainer.classList.add("avatar-container");

                const avatar = document.createElement("img");
                avatar.src = getAvatarUrl(user.username);
                avatar.alt = `${user.username}'s avatar`;
                avatar.classList.add("user-avatar");

                const statusDot = document.createElement("span");
                statusDot.classList.add("status-dot");

                statusDot.style.backgroundColor = user.is_connected ? "green" : "gray";

                avatarContainer.appendChild(avatar);
                avatarContainer.appendChild(statusDot);

                const usernameElement = document.createElement("p");
                usernameElement.textContent = user.username;
                usernameElement.classList.add("user-name");

                userInfo.appendChild(avatarContainer);
                userInfo.appendChild(usernameElement);

                const addButton = document.createElement("i");
                addButton.classList.add("bi", "add-button");
                addButton.style.cursor = "pointer";

                if (friendsUsernames.includes(user.username)) {
                    addButton.classList.add("bi-person-check");
                    addButton.style.color = "gray";
                    addButton.style.pointerEvents = "none";
                } 
                else {
                    const isPendingRequest = await checkPendingRequest(user.id);

                    if (isPendingRequest) {
                        addButton.classList.add("bi-person-plus");
                        addButton.style.color = "orange";
                        addButton.style.pointerEvents = "none";
                    } 
                    else {
                        addButton.classList.add("bi-person-add");
                        addButton.style.color = "green";
                        addButton.addEventListener("click", () => {
                            handleFriendRequest(user.id, addButton);
                        });
                    }
                }

                userRow.appendChild(userInfo);
                userRow.appendChild(addButton);

                contentContainer.appendChild(userRow);
            }
        }
        else
            contentContainer.innerHTML = `<p>${translations.noUsersFound}</p>`;
    } 
    else if (option === "invitations")
        await loadPendingInvitations();
}

export async function initializeFriendsPreview() {
    const expandButton = document.getElementById('expandFriendsBtn');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            document.getElementById('friendsModal').classList.remove('hidden');
            // Charger ici la liste complète des amis si nécessaire
        });
    }
    
    // Charger la prévisualisation des amis
    loadFriendsPreview();
}

async function loadFriendsPreview() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        console.warn("Aucun utilisateur connecté ou le nom d'utilisateur est manquant.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8001/users/${user.username}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            console.error("Erreur lors de la récupération de la liste des amis:", response.statusText);
            return;
        }

        const data = await response.json();
        const sortedFriends = data.friends.sort((a, b) => a.username.localeCompare(b.username));

        // Pour chaque ami, obtenir son statut `is_connected`
        const friendsWithStatus = await Promise.all(sortedFriends.map(async (friend) => {
            const friendDetails = await fetchUserDetails(friend.username);
            return {
                ...friend,
                is_connected: friendDetails.is_connected  // Ajoute le statut `is_connected`
            };
        }));

        // Sélectionner les 6 premiers amis pour l'aperçu
        const latestFriends = friendsWithStatus.slice(0, 6);
        displayFriendsPreview(latestFriends);

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

async function displayFriendsPreview(friends) {
    const friendsListPreview = document.querySelector('.friends-list-preview');
    friendsListPreview.innerHTML = ''; // Vide le contenu précédent

     // translations
     let translations = {};
     try {
         const { loadLanguages } = await import('../Modals/switchLanguages.js');
         const storedLang = localStorage.getItem('preferredLanguage') || 'en';
         translations = await loadLanguages(storedLang);
     }
     catch (error) {
         console.error("Error loading translations:", error);
     }

     if (friends.length === 0) {
        friendsListPreview.innerHTML = `<p style="color: #a16935;">${translations.noFriendsFound}</p>`;
        return;
    }    

    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.classList.add('friend-preview-item');

        // Conteneur pour l'avatar et la pastille de statut
        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('friend-avatar-container');

        // Avatar
        const avatar = document.createElement('img');
        avatar.src = getAvatarUrl(friend.username);
        avatar.alt = `${friend.username}'s avatar`;
        avatar.classList.add('friend-avatar-preview');

        // Pastille de statut
        const statusDot = document.createElement('span');
        statusDot.classList.add('status-dot-preview');
        statusDot.style.backgroundColor = friend.is_connected ? "green" : "gray"; // Indicateur en ligne ou hors ligne

        // Ajout de l'avatar et de la pastille dans le conteneur
        avatarContainer.appendChild(avatar);
        avatarContainer.appendChild(statusDot);

        // Nom d'utilisateur
        const username = document.createElement('p');
        username.textContent = friend.username;
        username.classList.add('friend-username-preview');

        // Ajout des éléments dans `friendItem`
        friendItem.appendChild(avatarContainer);
        friendItem.appendChild(username);

        friendsListPreview.appendChild(friendItem);
    });
}


