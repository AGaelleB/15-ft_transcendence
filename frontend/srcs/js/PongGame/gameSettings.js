// frontend/srcs/js/PongGame/gameSettings.js

export const gameSettings = {

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

    // Score
    winningScore: 0,

    // Power-ups
    powerUpEffectDuration: 7000, // 7 sec

    // Rally
    setRally: 0
};
