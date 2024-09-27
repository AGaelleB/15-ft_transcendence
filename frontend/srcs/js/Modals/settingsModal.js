// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings, loadSettingsOnPageLoad, initializeGameSettings } from './gameSettingsModal.js';
import { initializeWinMsg } from './winMsgModal.js';


export function initializeButton() {
    loadSettingsOnPageLoad();  // Charger les paramètres depuis localStorage au démarrage
    saveGameSettings();
    initializeGameSettings();
    saveGameSettings();
    initializeWinMsg();
}