// frontend/srcs/js/Modals/settingsModal.js

import { setPlayer1Score, setPlayer2Score, updateScore } from '../PongGame/score.js';
import { saveGameSettings, getIsSettingsOpen, loadSettingsOnPageLoad, initializeGameSettings } from './gameSettingsModal.js';
import { initializeWinMsg } from './winMsgModal.js';

loadSettingsOnPageLoad();  // Charger les paramètres depuis localStorage au démarrage

export function initializeButton() {
    saveGameSettings();
    initializeGameSettings();
    initializeWinMsg();
}