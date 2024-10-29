// frontend/srcs/js/Screens/multiPlayers2D.js

// import { startNextMatch } from "../Modals/winMsgModal";

export let isTournament = false;

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
            else if (currentValues[`player${i}`])
                input.value = currentValues[`player${i}`];

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

        // Set tournament mode to true
        isTournament = true;

        localStorage.setItem('tournamentPlayers', JSON.stringify(playerNames));
        createTournamentMatches(playerNames);
    });

    /****************************** Tournament Match Setup ******************************/

    function createTournamentMatches(playerNames) {
        shuffleArray(playerNames);  // Randomize player order

        const matchQueue = [];
        let numPlayers = playerNames.length;

        if (numPlayers % 2 !== 0) {
            // Odd number of players: last player vs AI
            matchQueue.push({ player1: playerNames.pop(), player2: "AI" });
            numPlayers--;
        }

        for (let i = 0; i < numPlayers; i += 2) {
            matchQueue.push({ player1: playerNames[i], player2: playerNames[i + 1] });
        }

        // Save match queue for the first round in localStorage
        localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));

        startNextMatch();
    }

    function startNextMatch() {
        const matchQueue = JSON.parse(localStorage.getItem("tournamentMatches"));

        console.log("startNextMatch in multiPlayers2D!");

        if (!matchQueue || matchQueue.length === 0) {
            console.log("Tournament is complete!");
            return;
        }

        const { player1, player2 } = matchQueue.shift();
        localStorage.setItem("tournamentMatches", JSON.stringify(matchQueue));

        if (player2 === "AI")
            window.history.pushState({}, "", "/1player-2d");
        else
            window.history.pushState({}, "", "/2players-2d");
        handleLocation();
    }

    /****************************** Helper Functions ******************************/

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}


/*  
    des que je fais l appel de startNextMatch, je ne peux plus jouer au 1player2d ni 2players2d. Or il ne devrait pas y avoir de probleme dans les autres games si cela concerne le multiplayer.
    c est pourquoi je me demande s il n y a pas un probleme d initialisation, peut etre dans le html, ou une initialisation de la fonction startNextMatch.

    

*/