// frontend/srcs/js/Screens/1Player2D.js

import { handleKeyPress2D, initializeGameStartListener2D, isGameStarted2D, setGameStarted2D } from '../Modals/startGameModal2D.js';
import { initializeButton2D } from '../Modals/settingsModal.js';
import { resizeCanvas } from '../PongGame/Game2D/resizeCanvas2D.js';
import { updateAI2D } from '../PongGame/Game2D/computerAI2D.js';
import { gameSettings2D } from '../PongGame/gameSettings.js';
import { startCountdown } from '../PongGame/chrono.js';
import { drawDottedLine, drawBall, drawPaddle } from '../PongGame/Game2D/draw2D.js';
import { setLastTouchedPaddle2D, handleWallCollision2D, checkBallOutOfBounds2D, checkPaddleCollision2D } from '../PongGame/Game2D/ballCollision2D.js';
import { setPlayer1Score2D, setPlayer2Score2D, updateScore2D, checkGameEnd2D, player1Score2D, player2Score2D, setIsGameOver2D, isGameOver2D, sendGameResult } from '../PongGame/Game2D/score2D.js';
import { createPowerUpImageElement2D, generatePowerUp2D, hidePowerUp, resetPowerUpTimer2D, applyPowerUpEffect2D, checkPowerUpCollision2D, resetPowerUpEffects2D} from '../PongGame/Game2D/power-ups2D.js';
import { incrementRallyCount2D, resetRallyCount2D } from '../PongGame/Game2D/rallyEffect2D.js';
import { loadLanguages } from '../Modals/switchLanguages.js';
import { loadPlayerInfos } from '../PongGame/playerInfos.js';
import { setTwoPlayerMode2D } from '../Modals/winMsgModal.js';
import { setIsGameOver3D } from '../PongGame/Game3D/score3D.js';
import { isTournament2D } from './tournament2D.js';

export let animationId2D1P;

export function initialize1Player2D() {
    
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const startGameMessage2D = document.getElementById('startGameMessage2D');
    const settingsIcon = document.getElementById('settingsIcon');
    const homeIcon = document.getElementById('homeIcon');
    const powerUpImageElement = createPowerUpImageElement2D();
    const opponentNameElement = document.getElementById('opponentName');
    if (opponentNameElement)
        opponentNameElement.textContent = "Mr Robot";
    
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguages(storedLang);

    loadPlayerInfos();
    setTwoPlayerMode2D(false); 
    
    let isGameActive2d = true;
    
    homeIcon.addEventListener('click', (event) => {
        cleanup1Player2D();
        event.preventDefault();
        window.history.pushState({}, "", "/home");
        handleLocation();
    });
    
    window.addEventListener('popstate', function(event) {
        cleanup1Player2D();
    });

    function cleanup1Player2D() {
        cancelAnimationFrame(animationId2D1P);

        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('keyup', handleKeyup);
        document.removeEventListener('keypress', handleKeyPress2D);
        window.removeEventListener('resize', onResizeCanvas);
    
        setTwoPlayerMode2D(false);  
        
        hidePowerUp(powerUpImageElement);
        resetRallyCount2D();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        isGameActive2d = false;
        setIsGameOver2D(false);
        setGameStarted2D(true);
    }

    setIsGameOver2D(false);
    setIsGameOver3D(false);

    function setIsGameActive2d(value) {
        if (typeof value === 'boolean')
            isGameActive2d = value;
    }

    let paddleSpeed = gameSettings2D.canvasHeight * gameSettings2D.paddleSpeedFactor;
    gameSettings2D.ballSpeedX2D

    initializeButton2D();
    initializeGameStartListener2D(startGameMessage2D, settingsIcon, homeIcon);

    const paddleLeft = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0,
        speedFactor: gameSettings2D.paddleSpeedFactor * 25
    };
    
    const paddleRight = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dy: 0,
        speedFactor: gameSettings2D.paddleSpeedFactor * 25
    };
    
    const ball = {
        x: 0,
        y: 0,
        size: 0,
        dx: 0,
        dy: 0
    };

    let ballOutOfBounds = false;

    function resetBall2D() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    
        const savedDx = ball.dx;
        const savedDy = ball.dy;
    
        setLastTouchedPaddle2D(null);

        ball.dx = 0;
        ball.dy = 0;

        if (gameSettings2D.setPowerUps) {
            resetPowerUpEffects2D(paddleLeft, paddleRight);
            hidePowerUp(powerUpImageElement);
            resetPowerUpTimer2D();
        }

        startCountdown(() => {
            const direction = Math.floor(Math.random() * 2);
            if (direction === 0)
                ball.dx = -savedDx;
            else
                ball.dx = savedDx;
            const verticalDirection = Math.floor(Math.random() * 2);
            if (verticalDirection === 0)
                ball.dy = savedDy;
            else
                ball.dy = -savedDy;
            ballOutOfBounds = false;
        });
    }

    function update() {
        updateScore2D(); 
        const gameEnded = checkGameEnd2D(player1Score2D, player2Score2D);
        if (gameEnded) {

            setIsGameActive2d(false);
            hidePowerUp(powerUpImageElement);

            // send game stats 
            const savedUser = localStorage.getItem('user');
            const user = JSON.parse(savedUser);
            let result;
            if (player1Score2D > player2Score2D)
                result = "V";
            else
                result = "D";
            if (!isTournament2D)
                sendGameResult(player1Score2D, player2Score2D, user.id, "2d", "1", result);
            return;
        }
    
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        handleWallCollision2D(ball, canvas);
        checkPaddleCollision2D(ball, paddleLeft, paddleRight, () => {
            ballOutOfBounds = false;
            incrementRallyCount2D();
        });
        
        // Check collision with power-up
        if (gameSettings2D.setPowerUps) {
            if (powerUpImageElement.style.display === 'block' && checkPowerUpCollision2D(ball, powerUpImageElement, canvas)) {
                applyPowerUpEffect2D(powerUpImageElement.src, paddleLeft, paddleRight);
                hidePowerUp(powerUpImageElement);
            }
        }

        if (checkBallOutOfBounds2D(ball, canvas, 
            () => setPlayer1Score2D(player1Score2D + 1), 
            () => setPlayer2Score2D(player2Score2D + 1))) {
                resetRallyCount2D();     
                const gameEnded = checkGameEnd2D(player1Score2D, player2Score2D);
                if (gameSettings2D.resetPaddlePosition && !gameEnded) {
                    paddleLeft.y = (canvas.height - paddleLeft.height) / 2;
                    paddleRight.y = (canvas.height - paddleRight.height) / 2;
                }
                resetBall2D();
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        drawPaddle(ctx, paddleLeft);
        drawDottedLine(ctx, canvas);
        drawPaddle(ctx, paddleRight);
        drawBall(ctx, ball);
        
        updateAI2D(ball, paddleRight, canvas);
    }

    const keys = {};

    function updatePaddleDirection() {
        if (keys['ArrowUp'] || keys['w'] || keys['W'])
            paddleLeft.dy = -window.paddleSpeed;
        else if (keys['ArrowDown'] || keys['s'] || keys['S'])
            paddleLeft.dy = window.paddleSpeed;
        else
            paddleLeft.dy = 0;
    }

    function handleKeydown(e) {
        keys[e.key] = true;
        updatePaddleDirection();
    }

    function handleKeyup(e) {
        keys[e.key] = false;
        updatePaddleDirection();
    }

    function movePaddles() {
        // Mouvement du joueur (gauche)
        paddleLeft.y += paddleLeft.dy * paddleLeft.speedFactor;
        if (paddleLeft.y < 0)
            paddleLeft.y = 0;
        if (paddleLeft.y > canvas.height - paddleLeft.height)
            paddleLeft.y = canvas.height - paddleLeft.height;
    
        // Mouvement de l'IA (droite)
        paddleRight.y += paddleRight.dy * paddleRight.speedFactor;
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        if (paddleRight.y > canvas.height - paddleRight.height)
            paddleRight.y = canvas.height - paddleRight.height;
    }

    // resize canvas and adjust elements
    window.onResizeCanvas = () => resizeCanvas(paddleLeft, paddleRight, ball);
    window.addEventListener('resize', onResizeCanvas);
    onResizeCanvas();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    function gameLoop1Player2D() {
        if (isGameActive2d && isGameStarted2D()) {
            update();
            movePaddles();
            if (gameSettings2D.setPowerUps)
                generatePowerUp2D(powerUpImageElement, canvas);
            
            else {
                resetPowerUpEffects2D(paddleLeft, paddleRight);
                hidePowerUp(powerUpImageElement);
                resetPowerUpTimer2D();
            }
        }
        else if (!isGameActive2d)
            return;
        else {
            hidePowerUp(powerUpImageElement);
            resetPowerUpTimer2D();
        }
        animationId2D1P = requestAnimationFrame(gameLoop1Player2D);
    }
    gameLoop1Player2D();
}

