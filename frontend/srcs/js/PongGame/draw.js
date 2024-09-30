// frontend/srcs/js/PongGame/draw.js
import { rallyCount, maxRallyBeforeSmoke } from './rallyEffect.js';

let smokeTrail = [];

export function getSmokeTrail() {
    return smokeTrail;
}

export function setSmokeTrail(newTrail) {
    smokeTrail = newTrail;
}

const maxSmokeParticles = 10;

function getSmokeSize(ball) {
    return ball.size * 0.6;
}

function addSmokeTrail(x, y) {
    const currentTrail = getSmokeTrail();

    currentTrail.push({ x, y, opacity: 1.0 });
    if (currentTrail.length > maxSmokeParticles) {
        currentTrail.shift();
    }
    setSmokeTrail(currentTrail);
}

export function drawSmokeTrail(ctx, ball) {
    const currentTrail = getSmokeTrail();
    const smokeSize = getSmokeSize(ball); // Calculate the consistent and proportional smoke size

    currentTrail.forEach((particle, index) => {
        ctx.fillStyle = `rgba(255, 204, 0, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, smokeSize * 1.2, 0, Math.PI * 2); // Use consistent smoke size
        ctx.fill();
        ctx.closePath();

        particle.opacity -= 0.09;
        if (particle.opacity <= 0)
            currentTrail.splice(index, 1);
    });
    setSmokeTrail(currentTrail);
}

export function drawPaddle(ctx, paddle) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

export function drawBall(ctx, ball) {
    drawSmokeTrail(ctx, ball);

    if (rallyCount >= maxRallyBeforeSmoke)
        addSmokeTrail(ball.x, ball.y);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.closePath();
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
