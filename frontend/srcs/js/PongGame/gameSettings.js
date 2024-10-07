// frontend/srcs/js/PongGame/gameSettings.js

export const gameSettings = {

    /*************** 2D et 3D **************/
    // Score
    winningScore: 0,

    // Power-ups
    powerUpEffectDuration: 7000, // 7 sec

    // Rally
    setRally: 0,

    /***************** 2D *****************/

    // Canvas dimensions
    canvasWidthFactor: 0.9,
    aspectRatio: 16 / 9, 

    // Paddle 
    resetPaddlePosition: 0,
    paddleWidthFactor: 0.035,
    paddleHeightFactor: 0.25,

    // Ball
    ballSizeFactor: 0.015,

    // Speed of the game
    paddleSpeedFactor: 5,
    ballSpeedX: 5,
    ballSpeedY: 5,

    // IA
    setPowerUps: 0,
    difficultyLevel: "novice",
    errorMargin: 0,
    aiSpeedFactor: 5,

    // Border
    borderFactor: 0.025,
    minBorderSize: 1,
    borderColor: '#a16935',
};

export const gameSettings3D = {
    ballRadius: 0.75,
    paddleWidth: 1,
    paddleHeight: 1.5,
    paddleDepth: 3.5,
    ballSpeed: 0.2,
    paddleSpeed: 0.3,
    pointsToWin: 5, // Assurez-vous que cette valeur par défaut est correcte
    resetPaddlePosition: false
};

// Nouvelle fonction pour charger les paramètres de localStorage
export function loadGameSettingsFromStorage() {
    const savedSettings = localStorage.getItem('gameSettings3D');
    if (savedSettings) {
        Object.assign(gameSettings3D, JSON.parse(savedSettings));
        console.log('Loaded game settings:', gameSettings3D);
    }
}
