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

async function updateVictoryDefeatBars(victoryPercentage, victories, defeats) {
    const defeatPercentage = 100 - victoryPercentage;

    const victoryBar = document.getElementById('victoryBar');
    const defeatBar = document.getElementById('defeatBar');

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

    const victoryText = translations.victories || "Victories";
    const defeatText = translations.defeats || "Defeats";

    // Set widths and default text with translations
    victoryBar.style.width = `${victoryPercentage}%`;
    victoryBar.textContent = `${victoryPercentage}% ${victoryText}`;

    defeatBar.style.width = `${defeatPercentage}%`;
    defeatBar.textContent = `${defeatPercentage}% ${defeatText}`;

    // Add hover events to show detailed game counts
    victoryBar.addEventListener('mouseover', () => {
        victoryBar.textContent = `${victories} ${victoryText}`;
    });
    victoryBar.addEventListener('mouseout', () => {
        victoryBar.textContent = `${victoryPercentage}% ${victoryText}`;
    });

    defeatBar.addEventListener('mouseover', () => {
        defeatBar.textContent = `${defeats} ${defeatText}`;
    });
    defeatBar.addEventListener('mouseout', () => {
        defeatBar.textContent = `${defeatPercentage}% ${defeatText}`;
    });
}


async function displayFilteredGames(games) {
    const historyDetails = document.getElementById('historyDetails');
    historyDetails.innerHTML = '';

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    const noGamesFoundMessage = translations.noGamesFound;
    if (games.length === 0) {
        historyDetails.innerHTML = `<p>${noGamesFoundMessage}</p>`;
        return;
    }

    // Tri des parties par ordre de date (décroissant)
    games.sort((a, b) => new Date(b.date) - new Date(a.date));

    games.forEach((game) => {
        const gameDetail = document.createElement('div');
        gameDetail.classList.add('game-detail');

        // Date de la partie
        const date = document.createElement('p');
        date.textContent = `${translations.dateLabel}: ${new Date(game.date).toLocaleDateString()}`;

        // Mode de jeu
        const mode = document.createElement('p');
        mode.textContent = `${translations.modeLabel}: ${game.game_mode.toUpperCase()}`;

        // Type de jeu
        const type = document.createElement('p');
        type.textContent = `${translations.typeLabel}: ${game.game_played === "1" ? translations.onePlayer : game.game_played === "2" ? translations.twoPlayers : translations.tournament}`;

        // Score de la partie
        const score = document.createElement('p');
        score.textContent = `${translations.scoreLabel}: ${game.game_played === "1" || game.game_played === "2" ? `${game.score} - ${game.opp_score}` : '-'}`;

        // Résultat de la partie
        const result = document.createElement('p');
        result.textContent = `${translations.resultLabel}: ${game.result === 'V' ? translations.victoriesStats : translations.defeatsStats}`;

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export function initializePreviewStats() {
    loadPreviewStats();

    const expandButton = document.getElementById('expand-button-stats');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            document.getElementById('historyModal').classList.remove('hidden');
        });
    }
    else {
        console.warn("Expand button not found in DOM.");
    }
}


async function loadPreviewStats() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        console.warn("No user logged in or username missing.");
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
            console.error("Error fetching match stats:", response.statusText);
            return;
        }

        const data = await response.json();
        const games = data.games.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante

        const latestGames = games.slice(0, 3); // Les 3 dernières parties
        displayLatestGames(latestGames);

        const victories = games.filter(game => game.result === 'V').length;
        const defeats = games.length - victories;
        createVictoryDefeatChart(victories, defeats);

    } catch (error) {
        console.error("Error loading preview stats:", error);
    }
}

async function displayLatestGames(latestGames) {
    const latestGamesContainer = document.querySelector('.latest-games');
    latestGamesContainer.innerHTML = '';

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.error("Error loading translations:", error);
    }

    const latestGamesTitleElement = document.querySelector('.title-container h3');
    if (latestGamesTitleElement)
        latestGamesTitleElement.textContent = translations.latestGamesTitle || "Latest Games";

    const noGamesFoundMessage = translations.noGamesFound;
    if (latestGames.length === 0) {
        latestGamesContainer.innerHTML = `<p style="color: #a16935; text-align: center;">${noGamesFoundMessage}</p>`;
        return;
    }

    latestGames.forEach(game => {
        const gameSummary = document.createElement('div');
        gameSummary.classList.add('game-summary');

        gameSummary.innerHTML = `
            <span>${new Date(game.date).toLocaleDateString()}</span>
            <span>${translations.modeLabel}: ${game.game_mode.toUpperCase()}</span>
            <span>${translations.typeLabel}: ${game.game_played === "1" ? translations.onePlayer : game.game_played === "2" ? translations.twoPlayers : translations.tournament}</span>
            <span>${translations.resultLabel}: ${game.result === 'V' ? translations.victoriesStats : translations.defeatsStats}</span>
        `;

        latestGamesContainer.appendChild(gameSummary);
    });
}

async function createVictoryDefeatChart(victories, defeats) {
    const ctx = document.getElementById('victoryDefeatChart').getContext('2d');
    const totalGames = victories + defeats;

    const chartData = totalGames > 0 ? [victories, defeats] : [1];
    const chartColors = totalGames > 0 ? ['#28a745', '#dc3545'] : ['#808080'];

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    } catch (error) {
        console.error("Error loading translations:", error);
    }

    new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: chartData,
                backgroundColor: chartColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Supprime la légende
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (totalGames === 0) {
                                return translations.noGamesFound || '0 games played';
                            }
                            else {
                                // Affiche le nombre de victoires ou de défaites selon la section survolée
                                const labelIndex = context.dataIndex;
                                if (labelIndex === 0) {
                                    return `${victories} ${translations.victories || 'Victoires'}`;
                                }
                                else if (labelIndex === 1) {
                                    return `${defeats} ${translations.defeats || 'Défaites'}`;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}


