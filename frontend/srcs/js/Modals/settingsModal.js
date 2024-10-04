// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings, loadSettingsOnPageLoad, initializeGameSettings } from './gameSettingsModal2D.js';
import { loadSettingsOnPageLoad3D, initializeGameSettings3D, saveGameSettings3D } from './gameSettingsModal3D.js';
import { initializeWinMsg } from './winMsgModal.js';
import { resetGame } from './startGameModal.js';

export function initializeButton2D() {
    loadSettingsOnPageLoad();  
    initializeGameSettings();
    saveGameSettings(); 
    initializeWinMsg();
    resetGame();
}

export function initializeButton3D() {
    loadSettingsOnPageLoad3D();  
    initializeGameSettings3D();
    saveGameSettings3D(); 
    // initializeWinMsg();
    resetGame();
}
