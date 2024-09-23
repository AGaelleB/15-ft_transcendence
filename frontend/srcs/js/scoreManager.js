// frontend/srcs/js/scoreManager.js

export let player1Score = 0;
export let player2Score = 0;

export function resetScores() {
    player1Score = 0;
    player2Score = 0;
}

export function updateScoreBoard() {
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

export function checkGameEnd(showWinMessage, settingsIcon, gameSettings) {
    if (player1Score >= gameSettings.winningScore) {
        showWinMessage(1);
        settingsIcon.classList.remove('hidden');
        return true;
    }
    else if (player2Score >= gameSettings.winningScore) {
        showWinMessage(2);
        settingsIcon.classList.remove('hidden');
        return true;
    }
    return false;
}
