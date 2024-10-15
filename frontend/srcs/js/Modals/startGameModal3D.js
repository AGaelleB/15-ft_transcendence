// frontend/srcs/js/Modals/startGameModal2D.js

import { getIsSettingsOpen } from './gameSettingsModal3D.js';
import { setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { startCountdown } from '../PongGame/chrono.js';

let gameStarted3D = false;

function startGame(startGameMessage, settingsIcon, homeIcon) {
    console.log("je cache mon press entrer to start the game !!!! ");
    startGameMessage.style.display = 'none';
    startGameMessage.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted3D = true;
}

export function resetGame3D() {
    // Réinitialiser les scores
    gameStarted3D = false;
    setPlayer1Score3D(0);
    setPlayer2Score3D(0);
    updateScore3D();

    // Réinitialiser la position des raquettes et de la balle
    paddleLeft.position.set(-28, 0, 0);
    paddleRight.position.set(28, 0, 0);
    ball.position.set(0, 0, 0);

    // Réinitialiser les vitesses de la balle
    gameSettings3D.ballSpeedX3D = 0;
    gameSettings3D.ballSpeedZ3D = 0;

    // Redémarrer le décompte avant le début du jeu
    startCountdown(() => {
        gameSettings3D.ballSpeedX3D = 0.2; // La vitesse initiale de la balle
        gameSettings3D.ballSpeedZ3D = 0.2;
    });
}

export function initializeGameStartListener3D(startGameMessage, settingsIcon, homeIcon) {
    function handleKeyPress(e) {
        if (!gameStarted3D && !getIsSettingsOpen() && (e.code === 'Space' || e.code === 'Enter')) {
            startGame(startGameMessage, settingsIcon, homeIcon);
            document.removeEventListener('keypress', handleKeyPress);
        }
    }
    document.addEventListener('keypress', handleKeyPress);
}

export function isGameStarted3D() {
    return gameStarted3D;
}