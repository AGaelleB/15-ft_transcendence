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

    closeProfileButtonFriends.addEventListener("click", closeFriendsModal);

    const radioButtons = document.querySelectorAll('input[name="friendsOptions"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            loadFriendsModalContent(radio.id);
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

async function sendFriendRequest(receiverId) {
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
                'Authorization': 'Bearer <your_auth_token>',
            },
            body: JSON.stringify({
                sender: currentUser.id,
                receiver: receiverId
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

async function fetchAllFriendRequests() {
    try {
        const response = await fetch("http://127.0.0.1:8001/friend-request/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export async function loadPendingInvitations() {
    const contentContainer = document.getElementById("friendsModalContent");
    contentContainer.innerHTML = "";

    const currentUser = JSON.parse(localStorage.getItem("user"));

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    const friendRequests = await fetchAllFriendRequests();

    const pendingInvites = friendRequests.filter(request => request.receiver.id === currentUser.id);

    if (pendingInvites.length > 0) {
        pendingInvites.forEach(invite => {
            const inviteRow = document.createElement("div");
            inviteRow.classList.add("user-row");

            const inviteInfo = document.createElement("div");
            inviteInfo.classList.add("user-info");

            const avatar = document.createElement("img");
            avatar.src = getAvatarUrl(invite.sender.username);
            avatar.alt = `${invite.sender.username}'s avatar`;
            avatar.classList.add("user-avatar");

            const username = document.createElement("p");
            username.textContent = invite.sender.username;
            username.classList.add("user-name");

            inviteInfo.appendChild(avatar);
            inviteInfo.appendChild(username);

            const acceptButton = document.createElement("i");
            acceptButton.classList.add("bi", "bi-check-square-fill", "accept-button");
            acceptButton.style.color = "green";
            acceptButton.style.cursor = "pointer";
            acceptButton.addEventListener("click", () => {
                handleFriendRequestAction(invite.id, "accept");
            });

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
    button.classList.remove("bi-person-add", "bi-person-plus", "bi-person-check");
    button.style.cursor = "pointer";
    button.style.pointerEvents = "auto";

    if (status === "pending") {
        button.classList.add("bi-person-plus");
        button.style.color = "orange";
        button.style.pointerEvents = "none";
    }
    else if (status === "accepted") {
        button.classList.add("bi-person-check");
        button.style.color = "gray";
        button.style.pointerEvents = "none";
    }
    else {
        button.classList.add("bi-person-add");
        button.style.color = "green";
        button.style.pointerEvents = "auto";
    }
}

async function handleFriendRequest(userId, button) {
    try {
        await sendFriendRequest(userId);
        updateFriendButtonStatus(button, "pending");
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

    return friendRequests.some(request => 
        (request.sender.id === currentUser.id && request.receiver.id === userId) ||
        (request.receiver.id === currentUser.id && request.sender.id === userId)
    );
}

export function openFriendsProfileModal() {
    const friendsProfileModal = document.getElementById("profileModalfriends");
    friendsProfileModal.classList.remove("hidden");
}

export function closeFriendsProfileModal() {
    const friendsProfileModal = document.getElementById("profileModalfriends");
    friendsProfileModal.classList.add("hidden");
}

export async function loadFriendsModalContent(option) {
    const contentContainer = document.getElementById("friendsModalContent");
    contentContainer.innerHTML = "";

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
            const sortedFriends = userDetails.friends.sort((a, b) => a.username.localeCompare(b.username));

            for (const friend of sortedFriends) {
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
                    openFriendsProfileModal();
                    initFriendsProfileModal(friend.username, username);
                });

                friendRow.appendChild(friendInfo);
                friendRow.appendChild(showProfileButton);

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

async function initFriendsProfileModal(friendUsername, myUsername) {
    const closeProfilFriendsModal = profileModalfriends.querySelector(".close-button-friends-profile");
    const friendDetails = await fetchUserDetails(friendUsername);

    closeProfilFriendsModal.addEventListener("click", closeFriendsProfileModal);

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    const avatarElement = document.querySelector(".profile-modal-picture-friends");
    if (avatarElement) {
        avatarElement.src = getAvatarUrl(friendDetails.username);
        avatarElement.alt = `${friendDetails.username}'s avatar`;
    }

    const usernameElement = document.querySelector(".username-dash-friends");
    if (usernameElement) {
        usernameElement.textContent = friendDetails.username;
    }

    const statusDot = document.createElement("span");
    statusDot.classList.add("status-dot-friends-profile");
    statusDot.style.backgroundColor = friendDetails.is_connected ? "green" : "gray";
    const avatarContainer = document.querySelector(".profile-picture-modal-friends");
    if (avatarContainer) {
        avatarContainer.appendChild(statusDot);
    }

    // Remplacement des boutons pour éviter les duplications d'écouteurs d'événements
    const removeFriendBtnOriginal = document.getElementById("removeFriendBtn");
    const removeFriendBtn = removeFriendBtnOriginal.cloneNode(true);
    removeFriendBtnOriginal.replaceWith(removeFriendBtn);

    const supprYesBtnOriginal = document.getElementById("supprYes");
    const supprYesBtn = supprYesBtnOriginal.cloneNode(true);
    supprYesBtnOriginal.replaceWith(supprYesBtn);

    const supprNoBtnOriginal = document.getElementById("supprNo");
    const supprNoBtn = supprNoBtnOriginal.cloneNode(true);
    supprNoBtnOriginal.replaceWith(supprNoBtn);

    const supprFriendConfirm = document.getElementById("supprFriendConfirm");

    // Ajout des écouteurs d'événements sans duplication
    removeFriendBtn.addEventListener("click", () => {
        supprFriendConfirm.classList.remove("hidden");
    });

    supprYesBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8001/users/${myUsername}/remove-friend/${friendDetails.username}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                console.log(`${friendDetails.username} has been removed from friends.`);
                closeFriendsProfileModal();
                supprFriendConfirm.classList.add("hidden");
                loadFriendsModalContent("friends"); // Recharge la liste des amis
            } else {
                console.error("Failed to remove friend:", response.statusText);
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    });

    supprNoBtn.addEventListener("click", () => {
        supprFriendConfirm.classList.add("hidden");
    });

    const games = friendDetails.games ? friendDetails.games.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

    const victories = games.filter(game => game.result === 'V').length;
    const defeats = games.length - victories;
    const totalGames = victories + defeats;
    const victoryPercentage = totalGames > 0 ? Math.round((victories / totalGames) * 100) : 0;
    const defeatPercentage = 100 - victoryPercentage;

    const victoryBarFriends = document.getElementById('victoryBarFriends');
    const defeatBarFriends = document.getElementById('defeatBarFriends');

    victoryBarFriends.style.width = '0%';
    defeatBarFriends.style.width = '0%';
    victoryBarFriends.style.backgroundColor = '#28a745';
    defeatBarFriends.style.backgroundColor = '#dc3545';
    victoryBarFriends.textContent = '';
    defeatBarFriends.textContent = '';

    const cloneVictoryBar = victoryBarFriends.cloneNode(true);
    const cloneDefeatBar = defeatBarFriends.cloneNode(true);
    victoryBarFriends.parentNode.replaceChild(cloneVictoryBar, victoryBarFriends);
    defeatBarFriends.parentNode.replaceChild(cloneDefeatBar, defeatBarFriends);

    if (totalGames === 0) {
        cloneVictoryBar.style.width = '100%';
        cloneVictoryBar.style.backgroundColor = '#808080';
        cloneVictoryBar.textContent = translations.noGamesPlayed || "0 games played";

    }
    else {
        cloneVictoryBar.style.width = `${victoryPercentage}%`;
        cloneDefeatBar.style.width = `${defeatPercentage}%`;

        cloneVictoryBar.textContent = `${victoryPercentage}% ${translations.victories || "Victories"}`;
        cloneDefeatBar.textContent = `${defeatPercentage}% ${translations.defeats || "Defeats"}`;

        cloneVictoryBar.addEventListener('mouseover', () => {
            cloneVictoryBar.textContent = `${victories} ${translations.victories || "Victories"}`;
        });
        cloneVictoryBar.addEventListener('mouseout', () => {
            cloneVictoryBar.textContent = `${victoryPercentage}% ${translations.victories || "Victories"}`;
        });

        cloneDefeatBar.addEventListener('mouseover', () => {
            cloneDefeatBar.textContent = `${defeats} ${translations.defeats || "Defeats"}`;
        });
        cloneDefeatBar.addEventListener('mouseout', () => {
            cloneDefeatBar.textContent = `${defeatPercentage}% ${translations.defeats || "Defeats"}`;
        });
    }

    const latestGamesContainer = document.getElementById('historyDetailsFriends');
    latestGamesContainer.innerHTML = '';

    const latestGamesTitleElement = document.querySelector('.title-container h3');
    if (latestGamesTitleElement) {
        latestGamesTitleElement.textContent = translations.latestGamesTitle || "Latest Games";
    }

    const noGamesFoundMessage = translations.noGamesFound || "No games found";
    
    if (games.length === 0) {
        latestGamesContainer.innerHTML = `<p style="color: #a16935; text-align: center;">${noGamesFoundMessage}</p>`;
        return;
    }

    games.slice(0, 100).forEach(game => {
        const gameSummary = document.createElement('div');
        gameSummary.classList.add('game-summary');

        gameSummary.innerHTML = `
            <span>${new Date(game.date).toLocaleDateString()}</span>
            <span>${translations.modeLabel || "Mode"}: ${game.game_mode.toUpperCase()}</span>
            <span>${translations.typeLabel || "Type"}: ${game.game_played === "1" ? translations.onePlayer || "1 Player" : game.game_played === "2" ? translations.twoPlayers || "2 Players" : translations.tournament || "Tournament"}</span>
            <span>${translations.resultLabel || "Result"}: ${game.result === 'V' ? translations.victoriesStats || "Victory" : translations.defeatsStats || "Defeat"}</span>
        `;
        latestGamesContainer.appendChild(gameSummary);
    });
}


export async function initializeFriendsPreview() {
    const expandButton = document.getElementById('expandFriendsBtn');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            document.getElementById('friendsModal').classList.remove('hidden');
        });
    }
    
    loadFriendsPreview();
}

async function loadFriendsPreview() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
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

        const friendsWithStatus = await Promise.all(sortedFriends.map(async (friend) => {
            const friendDetails = await fetchUserDetails(friend.username);
            return {
                ...friend,
                is_connected: friendDetails.is_connected
            };
        }));

        const latestFriends = friendsWithStatus.slice(0, 6);
        displayFriendsPreview(latestFriends);

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

async function displayFriendsPreview(friends) {
    const friendsListPreview = document.querySelector('.friends-list-preview');
    friendsListPreview.innerHTML = '';

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

        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('friend-avatar-container');

        const avatar = document.createElement('img');
        avatar.src = getAvatarUrl(friend.username);
        avatar.alt = `${friend.username}'s avatar`;
        avatar.classList.add('friend-avatar-preview');

        const statusDot = document.createElement('span');
        statusDot.classList.add('status-dot-preview');
        statusDot.style.backgroundColor = friend.is_connected ? "green" : "gray";

        avatarContainer.appendChild(avatar);
        avatarContainer.appendChild(statusDot);

        const username = document.createElement('p');
        username.textContent = friend.username;
        username.classList.add('friend-username-preview');

        friendItem.appendChild(avatarContainer);
        friendItem.appendChild(username);

        friendsListPreview.appendChild(friendItem);
    });
}


