// frontend/srcs/js/PongGame/Game2D/rallyEffect2D.js

export let rallyCount = 0;
export const maxRallyBeforeSmoke = 10;
let smokeTrail = [];
const maxSmokeParticles = 10;

export function resetRallyCount() {
    rallyCount = 0;
    setSmokeTrail([]);
}

export function incrementRallyCount() {
    rallyCount++;
}

export function getSmokeTrail() {
    return smokeTrail;
}

export function setSmokeTrail(newTrail) {
    smokeTrail = newTrail;
}

// Function to calculate a reasonable size for the smoke trail based on ball size
function getSmokeSize(ball) {
    return ball.size * 0.6; // Set to 60% of ball size to keep the trail small but proportional
}

export function addSmokeTrail(x, y) {
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
        ctx.arc(particle.x, particle.y, smokeSize, 0, Math.PI * 2); // Use consistent smoke size
        ctx.fill();
        ctx.closePath();

        particle.opacity -= 0.09;
        if (particle.opacity <= 0)
            currentTrail.splice(index, 1);
    });
    setSmokeTrail(currentTrail);
}

// Function to draw the psychedelic ball effect
export function drawPsychedelicBall(ctx, ball) {
    // Create a gradient to cycle through multiple colors
    const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.size / 4, ball.x, ball.y, ball.size);
    const colorOffset = Date.now() % 360; // Use time for animated effect

    // Add multiple color stops to the gradient for the psychedelic effect
    gradient.addColorStop(0, `hsl(${(colorOffset + 0) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.25, `hsl(${(colorOffset + 90) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${(colorOffset + 180) % 360}, 100%, 50%)`);
    gradient.addColorStop(0.75, `hsl(${(colorOffset + 270) % 360}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${(colorOffset + 360) % 360}, 100%, 50%)`);

    // Draw the ball with the psychedelic gradient effect
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}
