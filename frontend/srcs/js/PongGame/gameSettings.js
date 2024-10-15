// frontend/srcs/js/PongGame/gameSettings.js

export const gameSettings2D = {

    // Score
    winningScore: 0,

    // Power-ups
    powerUpEffectDuration2D: 7000,

    // Rally
    setRally: 0,

    // Canvas dimensions
    canvasWidthFactor: 0.9,
    aspectRatio: 16 / 9, 

    // Paddle 
    resetPaddlePosition: 0,
    paddleWidth2D: 0.035,
    paddleHeight2D: 0.25,

    // Ball
    ballSizeFactor2D: 0.015,

    // Speed of the game
    paddleSpeedFactor: 5,
    ballSpeedX2D: 5,
    ballSpeedY2D: 5,

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

    // Score
    pointsToWin: 5,

    // Power-ups
    powerUpEffectDuration3D: 7000,

    // Rally
    setRally3D: 0,

    // Canvas dimensions
    canvasWidthFactor: 0.9,
    aspectRatio: 16 / 9,

    // Paddle 
    resetPaddlePosition: false,
    paddleWidth3D: 1,
    paddleHeight3D: 1.5,
    paddleDepth3D: 3.5,
    
    // Ball
    ballRadius3D: 0.75,
    
    // Speed of the game
    paddleSpeed3D: 0,
    ballSpeedX3D: 0,
    ballSpeedZ3D: 0,

    // IA
    setPowerUps3D: 0,
    difficultyLevel3D: "novice",
    errorMargin3D: 4200,
    aiSpeedFactor3D: 5,
};

