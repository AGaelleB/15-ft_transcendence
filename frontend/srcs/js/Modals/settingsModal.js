// frontend/srcs/js/Modals/settingsModal.js

import { saveGameSettings, getIsSettingsOpen, loadSettingsOnPageLoad, initializeGameSettings } from './gameSettingsModal.js';
import { initializeWinMsg } from './winMsgModal.js';

loadSettingsOnPageLoad();  // Charger les paramètres depuis localStorage au démarrage

export function initializeButton() {
    saveGameSettings();
    initializeGameSettings();
    initializeWinMsg();
}