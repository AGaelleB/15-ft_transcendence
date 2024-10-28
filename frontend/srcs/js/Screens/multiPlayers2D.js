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


    /****************************** initializePlayerCount ******************************/
    const minPlayers = 3;
    const maxPlayers = 6;
    let playerCount = parseInt(document.getElementById('playerCount').value);

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
            
            if (currentValues[`player${i}`])
                input.value = currentValues[`player${i}`];
    
            playerFieldsContainer.appendChild(field);
        }
    }
    
    updatePlayerFields(playerCount);

    // Increase player count
    document.getElementById('increasePlayers').addEventListener('click', function () {
        if (playerCount < maxPlayers) {
            playerCount++;
            document.getElementById('playerCount').value = playerCount;
            updatePlayerFields(playerCount);
        }
    });

    // Decrease player count
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
        window.history.pushState({}, "", "/tournament-2d");
        handleLocation();
    });
    
}
