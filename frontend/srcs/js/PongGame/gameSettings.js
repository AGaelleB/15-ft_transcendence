// frontend/srcs/js/PongGame/gameSettings.js

export const gameSettings2D = {

    // Score
    winningScore: 5,

    // Power-ups
    setPowerUps: false,
    powerUpStart2D: 17000,
    powerUpEnd2D: 20000,
    powerUpEffectDuration2D: 7000,
    powerUpVisibilityDuration2D: 7000,

    // Rally
    setRally: false,

    // Canvas dimensions
    canvasWidthFactor: 0.9,
    aspectRatio: 16 / 9, 

    // Paddle 
    resetPaddlePosition: false,
    paddleWidth2D: 0.035,
    paddleHeight2D: 0.25,

    // Ball
    ballSizeFactor2D: 0.015,

    // Speed of the game
    paddleSpeedFactor: 0.035,
    ballSpeedX2D: 1.25,
    ballSpeedY2D: 1.25,

    // IA
    difficultyLevel: "intermediate",
    errorMargin: 0,
    aiSpeedFactor: 5,

    // Border
    borderFactor: 0.025,
    minBorderSize: 1,
    borderColor: '#a16935',
};

export const gameSettings3D = {

    // Score
    pointsToWin: 5,

    // Power-ups
    setPowerUps3D: false,
    powerUpStart3D: 3000,
    powerUpEnd3D: 5000,
    powerUpEffectDuration3D: 7000,
    powerUpVisibilityDuration3D: 7000,

    // Rally
    setRally3D: false,

    // Canvas dimensions
    canvasWidthFactor: 0.9,
    aspectRatio: 16 / 9,

    // Paddle 
    resetPaddlePosition: false,
    paddleWidth3D: 1,
    paddleHeight3D: 1.5,
    paddleDepth3D: 5,
    
    // Ball
    ballRadius3D: 0.75,
    
    // Speed of the game
    paddleSpeed3D: 0.3,
    ballSpeedX3D: 0.3,
    ballSpeedZ3D: 0.3,
    ballSpeedSAV: 0.3,

    // IA
    difficultyLevel3D: "intermediate",
    errorMargin3D: 4200,
    aiSpeedFactor3D: 5,
};