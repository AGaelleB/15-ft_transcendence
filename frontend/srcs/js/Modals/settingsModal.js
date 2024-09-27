// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings, loadSettingsOnPageLoad, initializeGameSettings } from './gameSettingsModal.js';
import { initializeWinMsg } from './winMsgModal.js';
import { resetGame } from './startGameModal.js';

export function initializeButton() {
    loadSettingsOnPageLoad();  
    initializeGameSettings();  
    saveGameSettings(); 
    initializeWinMsg();
    resetGame();
}