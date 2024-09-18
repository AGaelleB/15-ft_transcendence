document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item');
    let currentIndex = 0;

    // Fonction pour mettre à jour la sélection
    function updateSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Navigation au clavier
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
            currentIndex++;
            updateSelection();
        } else if (event.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
            updateSelection();
        } else if (event.key === 'Enter') {
            const selectedItem = menuItems[currentIndex].textContent;
            alert(`You selected: ${selectedItem}`);
        }
    });

    // Initialisation de la sélection
    updateSelection();
});
