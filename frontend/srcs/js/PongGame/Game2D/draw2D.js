// frontend/srcs/js/PongGame/Game2D/draw2D.js

import { gameSettings2D } from '../gameSettings.js';
import { rallyCount, maxRallyBeforeSmoke, drawPsychedelicBall, drawSmokeTrail, addSmokeTrail} from './rallyEffect2D.js';

export function drawPaddle(ctx, paddle) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

export function drawBall(ctx, ball) {
    if (rallyCount > 25 && (gameSettings2D.setRally === true))
        drawPsychedelicBall(ctx, ball);
    else {
        if (gameSettings2D.setRally === true)
            drawSmokeTrail(ctx, ball);
        if (rallyCount >= maxRallyBeforeSmoke && (gameSettings2D.setRally === true))
            addSmokeTrail(ball.x, ball.y);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
        ctx.closePath();
    }
}

export function drawDottedLine(ctx, canvas) {
    const lineWidth = canvas.width * 0.016;
    const gap = canvas.height * 0.04;

    ctx.strokeStyle = '#a16935';
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([lineWidth, gap]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([]);
}
