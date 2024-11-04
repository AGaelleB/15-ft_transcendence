// frontend/srcs/js/Screens/multiPlayers2D.js

export let isTournament = false;
export let tournamentPlayers = [];
export let currentMatchPlayers = {};
export let winners = []; 

export function initializeMulti2D() {
    
    function cleanup1PlayerTournament2D() {
        isTournament = false;
    }

    const homeIcon = document.getElementById('homeIcon');
    homeIcon.addEventListener('click', (event) => {
        cleanup1PlayerTournament2D();
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
    
    window.addEventListener('popstate', function(event) {
        cleanup1PlayerTournament2D();
        console.log("Retour arrière du navigateur détecté !");
    });

    /****************************** Player Setup *****************************/
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
        const playerNames = new Set();
        const inputs = document.querySelectorAll('#playerFields input');
    
        inputs.forEach(input => {
            const name = input.value.trim();
            if (!validatePlayerName(name) || playerNames.has(name)) {
                hasInvalidNames = true;
                alert(`Invalid name: ${name}. Player names must be unique.`);
            }
            playerNames.add(name);
        });
    
        if (hasInvalidNames)
            return;
    
        isTournament = true;
        tournamentPlayers = Array.from(playerNames); 
        localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
        createTournamentMatches2D(tournamentPlayers);
        startNextMatch2D();
    });
}


/**************************** Tournament Match Setup ****************************/

export function createTournamentMatches2D(playerNames) {
    const matchQueue = [];
    playerNames = shuffleArray(playerNames);

    const robotExists = playerNames.includes("Mr Robot");
    if (playerNames.length % 2 !== 0 && robotExists)
        playerNames = playerNames.filter(name => name !== "Mr Robot"); // retire "Mr Robot" si pas necessaire

    if (playerNames.length % 2 !== 0)
        playerNames.push("Mr Robot");

    for (let i = 0; i < playerNames.length; i += 2) {
        let player1 = playerNames[i];
        let player2 = playerNames[i + 1];

        // swap "Mr Robot" to be `player2`
        if (player1 === "Mr Robot")
            [player1, player2] = [player2, player1];

        // Skip if 2 * "Mr Robot"
        if (!(player1 === "Mr Robot" && player2 === "Mr Robot"))
            matchQueue.push({ player1, player2 });
    }

    localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));
    console.log("Tournament matches created:", matchQueue);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/************************** Tournament Match Management **************************/

export function startNextMatch2D() {
    const matchQueue = JSON.parse(localStorage.getItem("tournamentMatches")) || [];
    // console.log("Current match queue at start:", matchQueue);

    if (matchQueue.length === 0) {
        if (winners.length === 1) {
            console.log("%cTournament Complete - Champion is: " + winners[0], "color: yellow; font-weight: bold;");
            showWinMessageEndTournament2D(winners[0]);
            isTournament = false;
            winners = [];
            return;
        }
        if (winners.length > 1) {
            console.log("Starting next round with winners:", winners);
            createTournamentMatches2D(winners);
            winners = [];
            startNextMatch2D();
            return;
        }
    }

    // next match and set the players
    const { player1, player2 } = matchQueue.shift();
    currentMatchPlayers = { player1, player2 };
    localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));
    console.log(`Starting next match: ${player1} vs ${player2}`);

    // Redirect "Mr Robot" 
    if (player2 === "Mr Robot" || player1 === "Mr Robot")
        window.history.pushState({}, "", "/1player-2d");
    else
        window.history.pushState({}, "", "/2players-2d");
    handleLocation();
}


/****************************** Tournament Modal Logic ******************************/

export function handleNextMatchClick2D() {
    const modal = document.getElementById('winMsgModal');
    modal.style.display = 'none';
    startNextMatch2D();
}

export function showWinMessageTournament2D(winnerName) {
    const modal = document.getElementById('winMsgModal');
    const winnerMessage = document.getElementById('winnerMessage');
    const nextMatchButton = document.getElementById('nextMatchButton');

    if (!modal || !winnerMessage || !nextMatchButton) {
        console.error("Tournament modal elements are missing in the DOM");
        return;
    }

    winnerMessage.textContent = `${winnerName} wins this match!`;
    modal.style.display = 'block';

    if (winners[winners.length - 1] !== winnerName) {
        winners.push(winnerName);
        console.log(`%c*** winnerName added: ${winnerName} ***`, "color: magenta; font-weight: bold;");
    }

    nextMatchButton.addEventListener('click', handleNextMatchClick2D, { once: true });
}

export function showWinMessageEndTournament2D(championName) {
    const endTournamentModal = document.getElementById('endTournamentModal');
    const championNameElement = document.getElementById('championName');
    const homeButtonTournament = document.getElementById('homeButtonTournament');

    if (!endTournamentModal || !championNameElement || !homeButtonTournament) {
        console.error("End tournament modal elements are missing in the DOM");
        return;
    }

    championNameElement.textContent = championName;
    endTournamentModal.style.display = 'block';

    homeButtonTournament.addEventListener('click', () => {
        endTournamentModal.style.display = 'none';
        window.history.pushState({}, "", '/home');
        handleLocation();
    });
}


/* 
    mettre les langues 

    voir pour les settings dans les tournois 



*/
/* reste du code */

