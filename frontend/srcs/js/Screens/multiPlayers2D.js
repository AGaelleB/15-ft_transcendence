// frontend/srcs/js/Screens/multiPlayers2D.js

export let isTournament = false;

/****************************** Tournament Match Management ******************************/

export function startNextMatch() {
    const matchQueue = JSON.parse(localStorage.getItem("tournamentMatches")) || [];
    console.log("Current match queue at start:", matchQueue);

    if (matchQueue.length === 0) {
        console.log("Tournament Complete - No matches left.");
        isTournament = false;
        window.history.pushState({}, "", "/home");
        handleLocation();
        return;
    }

    const { player1, player2 } = matchQueue.shift();
    localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));

    console.log(`Starting next match: ${player1} vs ${player2}`);

    if (player2 === "AI") {
        console.log(`-----> Navigating to 1-player mode for next match}`);
        window.history.pushState({}, "", "/1player-2d");
    }
    else {
        console.log(`-----> Navigating to 2-player mode for next match}`);
        window.history.pushState({}, "", "/2players-2d");
    }

    handleLocation();
}


/****************************** Tournament Initialization ******************************/

export function initializeMulti2D() {
    const homeIcon = document.getElementById('homeIcon');
    homeIcon.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
    
    window.addEventListener('popstate', function(event) {
        console.log("Retour arrière du navigateur détecté !");
    });

    /****************************** Player Setup ******************************/
    const minPlayers = 3;
    const maxPlayers = 6;
    let playerCount = parseInt(document.getElementById('playerCount').value);

    const savedUser = JSON.parse(localStorage.getItem('user'));
    const loggedInUsername = savedUser ? savedUser.username : "Player 1";

    function validatePlayerName(name) {
        const regex = /^[a-zA-Z0-9]{1,20}$/;
        return regex.test(name);
    }

    function updatePlayerFields(count) {
        const playerFieldsContainer = document.getElementById('playerFields');
        const template = document.getElementById('playerFieldTemplate').content;

        const currentValues = {};
        Array.from(playerFieldsContainer.children).forEach((child, index) => {
            const input = child.querySelector('input');
            if (input) currentValues[`player${index + 1}`] = input.value;
        });

        playerFieldsContainer.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const field = template.cloneNode(true);
            const input = field.querySelector('input');
            input.setAttribute('name', `player${i}`);
            input.setAttribute('placeholder', `Player ${i} Name`);

            if (i === 1) {
                input.value = loggedInUsername;
                input.readOnly = true;
            }
            else if (currentValues[`player${i}`]) {
                input.value = currentValues[`player${i}`];
            }

            input.addEventListener('input', () => {
                if (!validatePlayerName(input.value)) {
                    alert("Player names must be alphanumeric and between 1 and 20 characters.");
                    input.value = input.value.slice(0, -1);
                }
            });

            playerFieldsContainer.appendChild(field);
        }
    }

    updatePlayerFields(playerCount);

    document.getElementById('increasePlayers').addEventListener('click', function () {
        if (playerCount < maxPlayers) {
            playerCount++;
            document.getElementById('playerCount').value = playerCount;
            updatePlayerFields(playerCount);
        }
    });

    document.getElementById('decreasePlayers').addEventListener('click', function () {
        if (playerCount > minPlayers) {
            playerCount--;
            document.getElementById('playerCount').value = playerCount;
            updatePlayerFields(playerCount);
        }
    });

    updatePlayerFields(playerCount);

    /****************************** Start Tournament ******************************/

    document.getElementById('startTournamentButton').addEventListener('click', () => {
        let hasInvalidNames = false;
        const playerNames = [];
        const inputs = document.querySelectorAll('#playerFields input');

        inputs.forEach(input => {
            const name = input.value.trim();
            if (!validatePlayerName(name))
                hasInvalidNames = true;
            playerNames.push(name);
        });

        if (hasInvalidNames) return;

        isTournament = true;

        localStorage.setItem('tournamentPlayers', JSON.stringify(playerNames));
        createTournamentMatches(playerNames);
        console.log("Start the first match of the tournament");
        startNextMatch();
    });

    /****************************** Tournament Match Setup ******************************/

    function createTournamentMatches(playerNames) {
        const matchQueue = [];

        // Logic to create a round-robin schedule for all players
        for (let i = 0; i < playerNames.length; i++) {
            for (let j = i + 1; j < playerNames.length; j++) {
                matchQueue.push({ player1: playerNames[i], player2: playerNames[j] });
            }
        }

        // Save match queue in localStorage
        localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));
        console.log("Tournament matches created:", matchQueue);
    }
}

/****************************** Tournament Modal Logic ******************************/

function handleNextMatchClick() {
    const modal = document.getElementById('winMsgModal');
    console.log("Next Match button clicked - proceeding to next match");
    modal.style.display = 'none';
    startNextMatch();
}

export function showWinMessageTournament(winnerName) {
    const modal = document.getElementById('winMsgModal');
    const winnerMessage = document.getElementById('winnerMessage');
    const nextMatchButton = document.getElementById('nextMatchButton');

    if (!modal || !winnerMessage || !nextMatchButton) {
        console.error("Tournament modal elements are missing in the DOM");
        return;
    }

    winnerMessage.textContent = `Congratulations, ${winnerName} wins this match!`;
    modal.style.display = 'block';

    // Suppression de tout écouteur existant pour éviter les doublons
    nextMatchButton.removeEventListener('click', handleNextMatchClick);

    // Ajout de l'écouteur pour passer au prochain match
    nextMatchButton.addEventListener('click', handleNextMatchClick, { once: true });
}



export function initializeWinMsgTournament() {
    const nextMatchButton = document.getElementById('nextMatchButton');
    if (nextMatchButton) {
        nextMatchButton.addEventListener('click', () => {
            const modal = document.getElementById('winMsgModal');
            console.log("initializeWinMsgTournament: Closing modal and starting next match");
            // nextMatchButton.removeEventListener('click', handleNextMatchClick);
            modal.style.display = 'none';
            // startNextMatch(); // doublons avec showWinMessageTournament
        });
    }
}


/* 

il y a un soucis, comme si showWinMessageTournament etait appele deux fois de suite au lancement du 2e match du tournois

voici mes logs si je fais une partie a 3 joueurs : 

avant demarrage du premier match : 
Tournament matches created: (3) [{…}, {…}, {…}]0: {player1: 'GagacMoi', player2: 'joueur2'}1: {player1: 'GagacMoi', player2: 'joueur3'}2: {player1: 'joueur2', player2: 'joueur3'}length: 3[[Prototype]]: Array(0)
multiPlayers2D.js:140 Start the first match of the tournament
multiPlayers2D.js:9 Current match queue at start: (3) [{…}, {…}, {…}]0: {player1: 'GagacMoi', player2: 'joueur3'}1: {player1: 'joueur2', player2: 'joueur3'}length: 2[[Prototype]]: Array(0)
multiPlayers2D.js:22 Starting next match: GagacMoi vs joueur2
multiPlayers2D.js:29 -----> Navigating to 2-player mode for next match}

lors du click pour "Start next match" :

initializeWinMsgTournament: Closing modal and starting next match
multiPlayers2D.js:182 Next Match button clicked - proceeding to next match
multiPlayers2D.js:9 Current match queue at start: (2) [{…}, {…}]0: {player1: 'joueur2', player2: 'joueur3'}length: 1[[Prototype]]: Array(0)
multiPlayers2D.js:22 Starting next match: GagacMoi vs joueur3
multiPlayers2D.js:29 -----> Navigating to 2-player mode for next match}
multiPlayers2D.js:182 Next Match button clicked - proceeding to next match
multiPlayers2D.js:9 Current match queue at start: [{…}]length: 0[[Prototype]]: Array(0)
multiPlayers2D.js:22 Starting next match: joueur2 vs joueur3
multiPlayers2D.js:29 -----> Navigating to 2-player mode for next match}

nouveau du click pour "Start next match" qui arrete le tournoi, meme si seulement 2 matchs on eu lieu:
initializeWinMsgTournament: Closing modal and starting next match
multiPlayers2D.js:182 Next Match button clicked - proceeding to next match
multiPlayers2D.js:9 Current match queue at start: []length: 0[[Prototype]]: Array(0)
multiPlayers2D.js:12 Tournament Complete - No matches left.
multiPlayers2D.js:182 Next Match button clicked - proceeding to next match
multiPlayers2D.js:9 Current match queue at start: []length: 0[[Prototype]]: Array(0)
multiPlayers2D.js:12 Tournament Complete - No matches left.
multiPlayers2D.js:182 Next Match button clicked - proceeding to next match
multiPlayers2D.js:9 Current match queue at start: []length: 0[[Prototype]]: Array(0)
multiPlayers2D.js:12 Tournament Complete - No matches left.


export function checkGameEnd2D() {
    const winningScore = gameSettings2D.winningScore;

    // Charger les noms des joueurs du tournoi
    const tournamentPlayers = JSON.parse(localStorage.getItem("tournamentPlayers")) || [];
    const player1Name = tournamentPlayers[0] || "Player 1";
    const player2Name = tournamentPlayers[1] || "Player 2";

    if (player1Score2D >= winningScore) {
        gameOver2D = true;
        if (isTournament)
            showWinMessageTournament(player1Name);
        else
            showWinMessage("player", player1Name);
        return true;
    } 
    else if (player2Score2D >= winningScore) {
        gameOver2D = true;
        if (isTournament)
            showWinMessageTournament(player2Name);
        else
            showWinMessage("2", player2Name);
        return true;
    }
    return false;
}
*/