// frontend/srcs/js/Screens/multiPlayers2D.js

export let isTournament = false;

/************************** Tournament Match Management **************************/

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
        // console.log(`-----> Navigating to 1-player mode for next match}`);
        window.history.pushState({}, "", "/1player-2d");
    }
    else {
        // console.log(`-----> Navigating to 2-player mode for next match}`);
        window.history.pushState({}, "", "/2players-2d");
    }
    handleLocation();
}

    /************************ Tournament Initialization ***********************/

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
        // console.log("Start the first match of the tournament");
        startNextMatch();
    });

    /**************************** Tournament Match Setup ****************************/

    function createTournamentMatches(playerNames) {
        const matchQueue = [];
    
        playerNames = shuffleArray(playerNames);
    
        if (playerNames.length % 2 !== 0)
            playerNames.push("AI");
    
        // Create matches by pairing shuffled players
        for (let i = 0; i < playerNames.length; i += 2) {
            matchQueue.push({ player1: playerNames[i], player2: playerNames[i + 1] });
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
}

/****************************** Tournament Modal Logic ******************************/

export function handleNextMatchClick() {
    const modal = document.getElementById('winMsgModal');
    // console.log("Next Match button clicked - proceeding to next match");
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

    nextMatchButton.addEventListener('click', handleNextMatchClick);
}

