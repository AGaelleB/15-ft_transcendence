// frontend/srcs/js/Modals/historyModal.js

export function initializeHistoryModal() {
    const generalStatsButton = document.getElementById('generalStatsButton');
    const myStatsButton = document.getElementById('myStatsButton');
    const generalStatsContainer = document.getElementById('generalStatsContainer');
    const myStatsContainer = document.getElementById('myStatsContainer');
    const expandButton = document.getElementById('expand-button-stats');
    const closeButton = document.getElementById('closeHistoryModal');
    const homeIcon = document.getElementById('homeIcon');

    // Gestion des onglets (General Stats et My Stats)
    if (generalStatsButton && myStatsButton) {
        generalStatsButton.addEventListener('click', () => {
            generalStatsButton.classList.add('active');
            myStatsButton.classList.remove('active');
            generalStatsContainer.classList.remove('hidden');
            myStatsContainer.classList.add('hidden');
            fetchAllUsersGames();
            displayPlayerRankings();
        });

        myStatsButton.addEventListener('click', () => {
            myStatsButton.classList.add('active');
            generalStatsButton.classList.remove('active');
            myStatsContainer.classList.remove('hidden');
            generalStatsContainer.classList.add('hidden');
            loadMatchHistory(); // Charge les données pour My Stats
        });
    }

    // Ouverture et fermeture du modal
    if (expandButton && closeButton) {
        expandButton.addEventListener('click', () => {
            if (homeIcon) homeIcon.classList.add('hidden');
            document.getElementById('historyModal').classList.remove('hidden');

            // Charge par défaut les General Stats à l'ouverture
            generalStatsButton.classList.add('active');
            myStatsButton.classList.remove('active');
            generalStatsContainer.classList.remove('hidden');
            myStatsContainer.classList.add('hidden');
            fetchAllUsersGames();
            displayPlayerRankings();
        });

        closeButton.addEventListener('click', () => {
            document.getElementById('historyModal').classList.add('hidden');
            if (homeIcon) homeIcon.classList.remove('hidden');
        });
    }

    // Gestion des filtres pour "My Stats"
    document.querySelectorAll('input[name="gameMode"]').forEach((input) => {
        input.addEventListener('change', applyFilters);
    });
    document.querySelectorAll('input[name="playerMode"]').forEach((input) => {
        input.addEventListener('change', applyFilters);
    });
}

async function fetchAllUsersGames() {
    try {
        // Étape 1 : Récupère tous les utilisateurs
        const usersResponse = await fetch('http://127.0.0.1:8001/users');
        if (!usersResponse.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await usersResponse.json();

        // Étape 2 : Récupère toutes les parties de chaque utilisateur
        const allGames = [];
        users.forEach(user => {
            user.games.forEach(game => {
                allGames.push({ ...game, username: user.username });
            });
        });

        // Étape 3 : Trie les parties par date décroissante
        allGames.sort((a, b) => b.id - a.id); // Tri basé sur l'ID croissant

        // Affiche les résultats dans le modal
        displayGlobalGames(allGames);
    } catch (error) {
        console.error('Error fetching games:', error);
        document.getElementById('allGamesList').innerHTML = '<p>Error loading games.</p>';
    }
}

function displayGlobalGames(games) {
    const gamesListContainer = document.getElementById('allGamesList');
    const totalGamesHeader = document.getElementById('totalGamesPlayed');

    // Met à jour le nombre total de parties
    totalGamesHeader.textContent = `Total Games Played: ${games.length}`;

    gamesListContainer.innerHTML = ''; // Efface l'ancien contenu

    if (games.length === 0) {
        gamesListContainer.innerHTML = '<p>No games found.</p>';
        return;
    }

    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.innerHTML = `
            <span class="game-detail-all">Player: ${game.username}</span>
            <span class="game-detail-all">Mode: ${game.game_mode.toUpperCase()}</span>
            <span class="game-detail-all">Type: ${game.game_played}</span>
            <span class="game-detail-all">Result: ${game.result}</span>
        `;
        gamesListContainer.appendChild(gameItem);
    });
}


async function displayPlayerRankings() {
    try {
        const usersResponse = await fetch('http://127.0.0.1:8001/users');
        if (!usersResponse.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await usersResponse.json();

        const currentUser = JSON.parse(localStorage.getItem('user')); // Récupère l'utilisateur actuel

        const playerRankings = users.map(user => {
            const wins = user.games.filter(game => game.result === 'V').length;
            return {
                username: user.username,
                wins: wins
            };
        });

        playerRankings.sort((a, b) => b.wins - a.wins);

        const myRankingIndex = playerRankings.findIndex(player => player.username === currentUser.username);
        const myRanking = myRankingIndex !== -1 ? playerRankings[myRankingIndex] : { username: "You", wins: 0 };

        const rankingHeader = document.getElementById('myRankingHeader');
        rankingHeader.innerHTML = `
            <div class="ranking-item my-ranking">
                <div class="ranking-number">#${myRankingIndex + 1}</div>
                <div class="ranking-name">${myRanking.username} (You)</div>
                <div class="ranking-wins">${myRanking.wins} Wins</div>
            </div>
        `;

        const rankingsContainer = document.getElementById('playerRankings');
        rankingsContainer.innerHTML = '';

        playerRankings.forEach((player, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.classList.add('ranking-item');
            rankingItem.classList.add(index % 2 === 0 ? 'even' : 'odd'); // Alternance de couleur

            // Ajout de la classe spéciale pour l'utilisateur actuel
            if (index === myRankingIndex) {
                rankingItem.id = "my-ranking-item"; // Ajoute un ID unique
                rankingItem.classList.add('current-user'); // Contour orange et style spécial
            }

            rankingItem.innerHTML = `
                <div class="ranking-number">#${index + 1}</div>
                <div class="ranking-name">${player.username} ${index === myRankingIndex ? '(You)' : ''}</div>
                <div class="ranking-wins">${player.wins} Wins</div>
            `;
            rankingsContainer.appendChild(rankingItem);
        });

        // Ajout d'un événement de clic pour recentrer sur la case utilisateur
        const myRankingHeaderElement = document.querySelector('.my-ranking');
        myRankingHeaderElement.addEventListener('click', () => {
            const myRankingItem = document.getElementById('my-ranking-item');
            if (myRankingItem) {
                myRankingItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    } catch (error) {
        console.error('Error fetching player rankings:', error);
        document.getElementById('playerRankings').innerHTML = '<p>Error loading rankings.</p>';
    }
}

////////////////////////////////// ANCIEN //////////////////////////
let allGames = [];

async function loadMatchHistory() {
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
            console.error("Error retrieving match history:", response.statusText);
            return;
        }

        const data = await response.json();
        allGames = data.games;
        applyFilters();

    }
    catch (error) {
        console.error("Data recovery error:", error);
    }
}

function applyFilters() {
    const selectedGameMode = document.querySelector('input[name="gameMode"]:checked').id;
    const selectedPlayerMode = document.querySelector('input[name="playerMode"]:checked').id;

    const filteredGames = allGames.filter((game) => {
        let matchesGameMode = false;
        let matchesPlayerMode = false;

        if (selectedGameMode === 'allMode') {
            matchesGameMode = true;
        }
        else if (selectedGameMode === 'mode2d' && game.game_mode === '2d') {
            matchesGameMode = true;
        }
        else if (selectedGameMode === 'mode3d' && game.game_mode === '3d') {
            matchesGameMode = true;
        }

        if (selectedPlayerMode === 'typeAll') {
            matchesPlayerMode = true;
        }
        else if (selectedPlayerMode === 'type1Player' && game.game_played === "1") {
            matchesPlayerMode = true;
        }
        else if (selectedPlayerMode === 'type2Players' && game.game_played === "2") {
            matchesPlayerMode = true;
        }
        else if (selectedPlayerMode === 'typeTournament' && game.game_played === "T") {
            matchesPlayerMode = true;
        }

        return matchesGameMode && matchesPlayerMode;
    });

    displayFilteredGames(filteredGames);

    const victories = filteredGames.filter(game => game.result === 'V').length;
    const defeats = filteredGames.length - victories;
    const victoryPercentage = filteredGames.length > 0 ? Math.round((victories / filteredGames.length) * 100) : 0;

    updateVictoryDefeatBars(victoryPercentage, victories, defeats);
}

async function updateVictoryDefeatBars(victoryPercentage, victories, defeats) {
    const totalGames = victories + defeats;
    const defeatPercentage = 100 - victoryPercentage;

    const victoryBar = document.getElementById('victoryBar');
    const defeatBar = document.getElementById('defeatBar');

    let translations = {};
    try {
        const { loadLanguages } = await import('../Modals/switchLanguages.js');
        const storedLang = localStorage.getItem('preferredLanguage') || 'en';
        translations = await loadLanguages(storedLang);
    }
    catch (error) {
        console.warn("Error loading translations:", error);
    }

    const victoryText = translations.victories || "Victories";
    const defeatText = translations.defeats || "Defeats";

    if (totalGames === 0) {
        victoryBar.style.width = '100%';
        defeatBar.style.width = '0';
        victoryBar.style.backgroundColor = '#808080';
        defeatBar.style.backgroundColor = '#808080';
        victoryBar.textContent = translations.noGamesPlayed || '0 games played';
        defeatBar.textContent = "";
    }
    else {
        victoryBar.style.width = `${victoryPercentage}%`;
        defeatBar.style.width = `${defeatPercentage}%`;
        victoryBar.style.backgroundColor = '#28a745';
        defeatBar.style.backgroundColor = '#dc3545';

        victoryBar.textContent = victoryPercentage > 0 ? `${victoryPercentage}% ${victoryText}` : '';
        defeatBar.textContent = defeatPercentage > 0 ? `${defeatPercentage}% ${defeatText}` : '';

        victoryBar.addEventListener('mouseover', () => {
            victoryBar.textContent = `${victories} ${victoryText}`;
        });
        victoryBar.addEventListener('mouseout', () => {
            victoryBar.textContent = victoryPercentage > 0 ? `${victoryPercentage}% ${victoryText}` : '';
        });

        defeatBar.addEventListener('mouseover', () => {
            defeatBar.textContent = `${defeats} ${defeatText}`;
        });
        defeatBar.addEventListener('mouseout', () => {
            defeatBar.textContent = defeatPercentage > 0 ? `${defeatPercentage}% ${defeatText}` : '';
        });
    }
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
        console.warn("Error loading translations:", error);
    }

    const noGamesFoundMessage = translations.noGamesFound;
    if (games.length === 0) {
        historyDetails.innerHTML = `<p>${noGamesFoundMessage}</p>`;
        return;
    }

    games.sort((a, b) => new Date(b.date) - new Date(a.date));

    games.forEach((game) => {
        const gameDetail = document.createElement('div');
        gameDetail.classList.add('game-detail');

        const date = document.createElement('p');
        date.textContent = `${translations.dateLabel}: ${new Date(game.date).toLocaleDateString()}`;

        const mode = document.createElement('p');
        mode.textContent = `${translations.modeLabel}: ${game.game_mode.toUpperCase()}`;

        const type = document.createElement('p');
        type.textContent = `${translations.typeLabel}: ${game.game_played === "1" ? translations.onePlayer : game.game_played === "2" ? translations.twoPlayers : translations.tournament}`;

        const score = document.createElement('p');
        score.textContent = `${translations.scoreLabel}: ${game.game_played === "1" || game.game_played === "2" ? `${game.score} - ${game.opp_score}` : '-'}`;

        const result = document.createElement('p');
        result.textContent = `${translations.resultLabel}: ${game.result === 'V' ? translations.victoriesStats : translations.defeatsStats}`;

        gameDetail.appendChild(date);
        gameDetail.appendChild(mode);
        gameDetail.appendChild(type);
        gameDetail.appendChild(score);
        gameDetail.appendChild(result);

        historyDetails.appendChild(gameDetail);
    });
}

export function initializePreviewStats() {
    loadPreviewStats();

    const expandButton = document.getElementById('expand-button-stats');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            document.getElementById('historyModal').classList.remove('hidden');
        });
    }
}


async function loadPreviewStats() {
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
            console.error("Error fetching match stats:", response.statusText);
            return;
        }

        const data = await response.json();
        const games = data.games.sort((a, b) => new Date(b.date) - new Date(a.date));

        const latestGames = games.slice(0, 3);
        displayLatestGames(latestGames);

        const victories = games.filter(game => game.result === 'V').length;
        const defeats = games.length - victories;
        createVictoryDefeatChart(victories, defeats);

    }
    catch (error) {
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
        console.warn("Error loading translations:", error);
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
        console.warn("Error loading translations:", error);
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
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (totalGames === 0) {
                                return translations.noGamesFound || '0 games played';
                            }
                            else {
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


