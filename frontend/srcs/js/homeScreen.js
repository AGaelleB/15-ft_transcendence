document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    let currentIndex = 0;

    function updateSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.parentElement.classList.add('selected');
            } else {
                item.parentElement.classList.remove('selected');
            }
        });
    }

    document.addEventListener('keydown', function(event) {
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
