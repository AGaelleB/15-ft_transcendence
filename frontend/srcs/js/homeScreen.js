// frontend/srcs/js/homeScreen.js

document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    let currentIndex = 0;
    let keyboardNavigationEnabled = true;

    function updateSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.parentElement.classList.add('selected');
            } else {
                item.parentElement.classList.remove('selected');
            }
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

        item.addEventListener('click', function() {
            item.click();
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
            menuItems[currentIndex].click();
        }
    });

    updateSelection();
});