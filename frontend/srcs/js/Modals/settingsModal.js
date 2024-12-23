// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings2D, loadSettingsOnPageLoad2D, initializeGameSettings2D } from './gameSettingsModal2D.js';
import { loadSettingsOnPageLoad3D, initializeGameSettings3D, saveGameSettings3D } from './gameSettingsModal3D.js';
import { initializeWinMsg, initializeWinMsgTournament } from './winMsgModal.js';
import { resetGame2D } from './startGameModal2D.js';
import { resetGame3D } from './startGameModal3D.js';
import { isTournament2D } from '../Screens/tournament2D.js';
import { isTournament3D } from '../Screens/tournament3D.js';

export function initializeButton2D() {
    loadSettingsOnPageLoad2D();
    initializeGameSettings2D();
    saveGameSettings2D();
    if (isTournament2D)
        initializeWinMsgTournament();
    else
        initializeWinMsg();
    resetGame2D();
}

export function initializeButton3D() {
    loadSettingsOnPageLoad3D();
    initializeGameSettings3D();
    saveGameSettings3D();
    if (isTournament3D)
        initializeWinMsgTournament();
    else
        initializeWinMsg();
    resetGame3D();
}
