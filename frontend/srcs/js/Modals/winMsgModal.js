// frontend/srcs/js/Modals/winMsgModal.js

export function showWinMessage(winner) {
    const winnerMessage = document.querySelector('.message');
    winnerMessage.innerHTML = `Player ${winner} Wins! <i class="bi bi-emoji-sunglasses"></i>`;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
}
