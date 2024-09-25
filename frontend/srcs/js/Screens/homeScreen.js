// frontend/srcs/js/Screens/homeScreen.js

document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    let currentIndex = 0;
    let keyboardNavigationEnabled = true;

    function updateSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentIndex)
                item.parentElement.classList.add('selected');
            else
                item.parentElement.classList.remove('selected');
        });
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            keyboardNavigationEnabled = false;
            currentIndex = index;
            updateSelection();
        });

        item.addEventListener('mouseleave', function() {
            keyboardNavigationEnabled = true;
        });

        item.addEventListener('click', function(event) {
            event.preventDefault();

            const mode = item.innerText.trim();  // "1 PLAYER", "2 PLAYERS", "MULTI PLAYERS"
            localStorage.setItem('gameMode', mode);

            window.location.href = item.getAttribute('href');
        });
    });

    document.addEventListener('keydown', function(event) {
        if (!keyboardNavigationEnabled) return;

        if (event.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
            currentIndex++;
            updateSelection();
        } else if (event.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
            updateSelection();
        } else if (event.key === 'Enter') {
            const selectedItem = menuItems[currentIndex];

            const mode = selectedItem.innerText.trim();
            localStorage.setItem('gameMode', mode);

            window.location.href = selectedItem.getAttribute('href');
        }
    });

    updateSelection();
});
