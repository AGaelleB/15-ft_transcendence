// frontend/srcs/js/Screens/multiPlayers2D.js

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
        return (regex.test(name));
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
            } else if (currentValues[`player${i}`]) {
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

        if (hasInvalidNames)
            return;

        localStorage.setItem('tournamentPlayers', JSON.stringify(playerNames));

        // Navigate to tournament-2d
        window.history.pushState({}, "", "/tournament-2d");
        handleLocation();
    });
}
