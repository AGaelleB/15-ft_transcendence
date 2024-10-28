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

    const minPlayers = 3;
    const maxPlayers = 6;
    let playerCount = parseInt(document.getElementById('playerCount').value);

    function updatePlayerFields(count) {
        const playerFieldsContainer = document.getElementById('playerFields');
        const template = document.getElementById('playerFieldTemplate').content;
        
        // Sauvegarder les valeurs actuelles
        const currentValues = {};
        Array.from(playerFieldsContainer.children).forEach((child, index) => {
            const input = child.querySelector('input');
            if (input) currentValues[`player${index + 1}`] = input.value;
        });
    
        // Vider les champs existants
        playerFieldsContainer.innerHTML = '';
    
        // Recréer les champs et restaurer les valeurs
        for (let i = 1; i <= count; i++) {
            const field = template.cloneNode(true);
            const input = field.querySelector('input');
            input.setAttribute('name', `player${i}`);
            input.setAttribute('placeholder', `Player ${i} Name`);
            
            // Restaurer la valeur si elle existe
            if (currentValues[`player${i}`]) {
                input.value = currentValues[`player${i}`];
            }
    
            playerFieldsContainer.appendChild(field);
        }
    }
    
    
    // Initialize fields with the minimum players count
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

    // Initial setup for fields
    updatePlayerFields(playerCount);
}
