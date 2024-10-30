// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings2D, loadSettingsOnPageLoad2D, initializeGameSettings2D } from './gameSettingsModal2D.js';
import { loadSettingsOnPageLoad3D, initializeGameSettings3D, saveGameSettings3D } from './gameSettingsModal3D.js';
import { initializeWinMsg, initializeWinMsgTournament } from './winMsgModal.js';
import { resetGame2D } from './startGameModal2D.js';
import { resetGame3D } from './startGameModal3D.js';
import { isTournament } from '../Screens/multiPlayers2D.js';

export function initializeButton2D() {
    loadSettingsOnPageLoad2D();
    initializeGameSettings2D();
    saveGameSettings2D();
    if (isTournament)
        initializeWinMsgTournament();
    else
        initializeWinMsg();
    resetGame2D();
}

export function initializeButton3D() {
    loadSettingsOnPageLoad3D();
    initializeGameSettings3D();
    saveGameSettings3D();
    initializeWinMsg();
    resetGame3D();
}


