// frontend/srcs/js/PongGame/Game2D/rallyEffect2D.js

export let rallyCount = 0;
export const maxRallyBeforeSmoke = 10;
let smokeTrail = [];
const maxSmokeParticles = 10;

export function getSmokeTrail() {
    return smokeTrail;
}

function getSmokeSize(ball) {
    return ball.size * 0.6;
}

export function setSmokeTrail(newTrail) {
    smokeTrail = newTrail;
}

export function resetRallyCount() {
    rallyCount = 0;
    setSmokeTrail([]);
}

export function incrementRallyCount() {
    rallyCount++;
}

export function addSmokeTrail(x, y) {
    const currentTrail = getSmokeTrail();

    currentTrail.push({ x, y, opacity: 1.0 });
    if (currentTrail.length > maxSmokeParticles)
        currentTrail.shift();
    setSmokeTrail(currentTrail);
}

export function drawSmokeTrail(ctx, ball) {
    const currentTrail = getSmokeTrail();
    const smokeSize = getSmokeSize(ball);

    currentTrail.forEach((particle, index) => {
        ctx.fillStyle = `rgba(255, 204, 0, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, smokeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        particle.opacity -= 0.09;
        if (particle.opacity <= 0)
            currentTrail.splice(index, 1);
    });
    setSmokeTrail(currentTrail);
}

export function drawPsychedelicBall(ctx, ball) {
    const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.size / 4, ball.x, ball.y, ball.size);
    const colorOffset = Date.now() % 360;

    gradient.addColorStop(0, `hsl(${(colorOffset + 0) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.25, `hsl(${(colorOffset + 90) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${(colorOffset + 180) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.75, `hsl(${(colorOffset + 270) % 360}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${(colorOffset + 360) % 360}, 100%, 50%)`);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}
