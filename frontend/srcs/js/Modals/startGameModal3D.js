// frontend/srcs/js/Modals/startGameModal3D.js

import { getIsSettingsOpen3D } from './gameSettingsModal3D.js';
import { getUserFromStorage3D, setPlayer1Score3D, setPlayer2Score3D, updateScore3D } from '../PongGame/Game3D/score3D.js';
import { ball, paddleLeft, paddleRight } from '../PongGame/Game3D/draw3D.js';
import { gameSettings3D } from '../PongGame/gameSettings.js';
import { currentMatchPlayers3D, isTournament3D } from '../Screens/tournament3D.js';
import { isTwoPlayerMode3D } from './winMsgModal.js';


export let gameStarted3D = false;

export function isGameStarted3D() {
    return gameStarted3D;
}

export function setGameStarted3D(value) {
    if (typeof value === 'boolean')
        gameStarted3D = value;
}

function startGame3D(startGameMessage3D, settingsIcon, homeIcon) {
    startGameMessage3D.style.display = 'none';
    startGameMessage3D.classList.add('hidden');
    settingsIcon.classList.add('hidden');
    homeIcon.classList.add('hidden');
    gameStarted3D = true;
}

export function resetGame3D() {
    gameStarted3D = false;
    setPlayer1Score3D(0);
    setPlayer2Score3D(0);
    updateScore3D();

    paddleLeft.position.set(-28, 0, 0);
    paddleRight.position.set(28, 0, 0);
    ball.position.set(0, 0, 0);
    gameSettings3D.ballSpeedZ3D = gameSettings3D.ballSpeedSAV;
    gameSettings3D.ballSpeedX3D = gameSettings3D.ballSpeedSAV;
}

export function handleKeyPress3D(e) {
    if (!gameStarted3D && !getIsSettingsOpen3D() && (e.code === 'Space' || e.code === 'Enter')) {
        startGame3D(startGameMessage3D, settingsIcon, homeIcon);
        document.removeEventListener('keypress', handleKeyPress3D);
    }
}

export function initializeGameStartListener3D(startGameMessage3D, settingsIcon, homeIcon) {
    let player1Name;
    let player2Name;
    
    if (isTournament3D)
        homeIcon.style.display = 'none';

    if (isTournament3D) {
        player1Name = currentMatchPlayers3D.player1;
        player2Name = currentMatchPlayers3D.player2;
    }
    else {
        player1Name = getUserFromStorage3D(); 
        player2Name = isTwoPlayerMode3D ? "Player 2" : "Mr Robot";
    }

    const player1NameElement = document.getElementById('player1Name');
    const player2NameElement = document.getElementById('player2Name');
    if (player1NameElement) player1NameElement.textContent = player1Name;
    if (player2NameElement) player2NameElement.textContent = player2Name;

    startGameMessage3D.style.display = 'block';
    document.addEventListener('keypress', handleKeyPress3D);
}

