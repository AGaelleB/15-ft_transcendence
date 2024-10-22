// frontend/srcs/js/PongGame/Game2D/rallyEffect2D.js

export let rallyCount2D = 0;
export const rallySmokeEffect2D = 10;
let smokeTrail = [];
const maxSmokeParticles = 10;

function getSmokeTrail2D() {
    return smokeTrail;
}

function getSmokeSize2D(ball) {
    return ball.size * 0.6;
}

function setSmokeTrail2D(newTrail) {
    smokeTrail = newTrail;
}

export function resetRallyCount2D() {
    rallyCount2D = 0;
    setSmokeTrail2D([]);
}

export function incrementRallyCount2D() {
    rallyCount2D++;
}

export function addSmokeTrail2D(x, y) {
    const currentTrail = getSmokeTrail2D();

    currentTrail.push({ x, y, opacity: 1.0 });
    if (currentTrail.length > maxSmokeParticles)
        currentTrail.shift();
    setSmokeTrail2D(currentTrail);
}

export function drawSmokeTrail2D(ctx, ball) {
    const currentTrail = getSmokeTrail2D();
    const smokeSize = getSmokeSize2D(ball);

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
    setSmokeTrail2D(currentTrail);
}

export function drawPsychedelicBall2D(ctx, ball) {
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
