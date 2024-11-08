export function initializeHistoryModal() {
    const expandButton = document.getElementById('expand-button-stats');
    const closeButton = document.getElementById('closeHistoryModal');
    
    if (expandButton && closeButton) {
        expandButton.addEventListener('click', () => {
            document.getElementById('historyModal').classList.remove('hidden');
            loadMatchHistory();
        });

        closeButton.addEventListener('click', () => {
            document.getElementById('historyModal').classList.add('hidden');
        });
    } else {
        console.warn("Les éléments nécessaires pour le modal d'historique ne sont pas disponibles dans le DOM.");
    }

    // Ajout des écouteurs pour les filtres
    document.querySelectorAll('input[name="gameMode"]').forEach((input) => {
        input.addEventListener('change', applyFilters);
    });
    document.querySelectorAll('input[name="playerMode"]').forEach((input) => {
        input.addEventListener('change', applyFilters);
    });
}

let allGames = []; // Pour stocker toutes les parties chargées

async function loadMatchHistory() {
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
            console.error("Erreur lors de la récupération de l'historique des matchs:", response.statusText);
            return;
        }

        const data = await response.json();
        allGames = data.games; // Stocke toutes les parties
        applyFilters(); // Applique les filtres après avoir chargé les données

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

function applyFilters() {
    const selectedGameMode = document.querySelector('input[name="gameMode"]:checked').id;
    const selectedPlayerMode = document.querySelector('input[name="playerMode"]:checked').id;

    // Filtre les parties en fonction des options sélectionnées
    const filteredGames = allGames.filter((game) => {
        let matchesGameMode = false;
        let matchesPlayerMode = false;

        if (selectedGameMode === 'allMode') {
            matchesGameMode = true;
        } else if (selectedGameMode === 'mode2d' && game.game_mode === '2d') {
            matchesGameMode = true;
        } else if (selectedGameMode === 'mode3d' && game.game_mode === '3d') {
            matchesGameMode = true;
        }

        if (selectedPlayerMode === 'typeAll') {
            matchesPlayerMode = true;
        } else if (selectedPlayerMode === 'type1Player' && game.game_played === "1") {
            matchesPlayerMode = true;
        } else if (selectedPlayerMode === 'type2Players' && game.game_played === "2") {
            matchesPlayerMode = true;
        } else if (selectedPlayerMode === 'typeTournament' && game.game_played === "T") {
            matchesPlayerMode = true;
        }

        return matchesGameMode && matchesPlayerMode;
    });

    displayFilteredGames(filteredGames);

    // Calculer le nombre de victoires et de défaites pour les parties filtrées
    const victories = filteredGames.filter(game => game.result === 'V').length;
    const defeats = filteredGames.length - victories;
    const victoryPercentage = filteredGames.length > 0 ? Math.round((victories / filteredGames.length) * 100) : 0;

    // Mettre à jour les barres de victoires et défaites en fonction des filtres
    updateVictoryDefeatBars(victoryPercentage, victories, defeats);
}

function updateVictoryDefeatBars(victoryPercentage, victories, defeats) {
    const defeatPercentage = 100 - victoryPercentage;

    const victoryBar = document.getElementById('victoryBar');
    const defeatBar = document.getElementById('defeatBar');

    // Définir les largeurs et les textes par défaut
    victoryBar.style.width = `${victoryPercentage}%`;
    victoryBar.textContent = `${victoryPercentage}% Victoires`;

    defeatBar.style.width = `${defeatPercentage}%`;
    defeatBar.textContent = `${defeatPercentage}% Défaites`;

    // Ajout des événements de survol pour afficher le nombre de parties
    victoryBar.addEventListener('mouseover', () => {
        victoryBar.textContent = `${victories} Victoires`;
    });
    victoryBar.addEventListener('mouseout', () => {
        victoryBar.textContent = `${victoryPercentage}% Victoires`;
    });

    defeatBar.addEventListener('mouseover', () => {
        defeatBar.textContent = `${defeats} Défaites`;
    });
    defeatBar.addEventListener('mouseout', () => {
        defeatBar.textContent = `${defeatPercentage}% Défaites`;
    });
}

function displayFilteredGames(games) {
    const historyDetails = document.getElementById('historyDetails');
    historyDetails.innerHTML = ''; // Vide le contenu précédent

    if (games.length === 0) {
        historyDetails.innerHTML = '<p>Aucune partie trouvée pour ce filtre.</p>';
        return;
    }

    // Tri des parties par ordre de date (décroissant)
    games.sort((a, b) => new Date(b.date) - new Date(a.date));

    games.forEach((game) => {
        const gameDetail = document.createElement('div');
        gameDetail.classList.add('game-detail');

        // Date de la partie
        const date = document.createElement('p');
        date.textContent = `Date: ${new Date(game.date).toLocaleDateString()}`;

        // Mode de jeu
        const mode = document.createElement('p');
        mode.textContent = `Mode: ${game.game_mode.toUpperCase()}`;

        // Type de jeu
        const type = document.createElement('p');
        type.textContent = `Type: ${game.game_played === "1" ? "1PLAYER" : game.game_played === "2" ? "2PLAYERS" : "TOURNAMENT"}`;
        
        // Score de la partie
        const score = document.createElement('p');
        score.textContent = `Score: ${game.game_played === "1" || game.game_played === "2" ? `${game.score} - ${game.opp_score}` : '-'}`;

        // Résultat de la partie
        const result = document.createElement('p');
        result.textContent = `Résultat: ${game.result === 'V' ? 'Victoire' : 'Défaite'}`;

        // Ajoute chaque élément dans la case
        gameDetail.appendChild(date);
        gameDetail.appendChild(mode);
        gameDetail.appendChild(type);
        gameDetail.appendChild(score);
        gameDetail.appendChild(result);

        // Ajoute la case au conteneur principal
        historyDetails.appendChild(gameDetail);
    });
}
