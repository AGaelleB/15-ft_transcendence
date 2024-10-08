// frontend/srcs/js/PongGame/Game2D/draw2D.js

import { rallyCount, maxRallyBeforeSmoke, drawPsychedelicBall, drawSmokeTrail, addSmokeTrail} from './rallyEffect2D.js';

export function drawPaddle(ctx, paddle) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

export function drawBall(ctx, ball) {
    // Stop drawing smoke trail and switch to psychedelic effect after 25 exchanges
    if (rallyCount > 25) {
        drawPsychedelicBall(ctx, ball);
    }
    else {
        drawSmokeTrail(ctx, ball);
        if (rallyCount >= maxRallyBeforeSmoke)
            addSmokeTrail(ball.x, ball.y);

        // Draw normal yellow ball
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

    ctx.setLineDash([]); // Reset dash after drawing
}
