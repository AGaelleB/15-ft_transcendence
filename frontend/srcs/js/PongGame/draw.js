// frontend/srcs/js/PongGame/draw.js

import { rallyCount, maxRallyBeforeSmoke } from './rallyEffect.js';

// Array to store smoke particles
let smokeTrail = [];

// Getter for smokeTrail
export function getSmokeTrail() {
    return smokeTrail;
}

// Setter for smokeTrail
export function setSmokeTrail(newTrail) {
    smokeTrail = newTrail;
}
// Maximum number of smoke particles to be drawn
const maxSmokeParticles = 10;

// Function to add smoke particles behind the ball
function addSmokeTrail(x, y) {
    // Get the current smoke trail
    const currentTrail = getSmokeTrail();

    // Push a new particle to the smoke trail array with position and opacity
    currentTrail.push({ x, y, opacity: 1.0 });

    // Keep the smoke trail array length within the max limit
    if (currentTrail.length > maxSmokeParticles) {
        currentTrail.shift();
    }

    // Set the updated smoke trail
    setSmokeTrail(currentTrail);
}

// Function to draw smoke trail
export function drawSmokeTrail(ctx) {
    const currentTrail = getSmokeTrail();

    currentTrail.forEach((particle, index) => {
        // Set the color and opacity for the smoke particle
        ctx.fillStyle = `rgba(255, 204, 0, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2); // Adjust size as needed
        ctx.fill();
        ctx.closePath();

        // Fade out the particle over time
        particle.opacity -= 0.09;

        // Remove particle if it is fully transparent
        if (particle.opacity <= 0) {
            currentTrail.splice(index, 1);
        }
    });

    // Update the smoke trail
    setSmokeTrail(currentTrail);
}

export function drawPaddle(ctx, paddle) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Update drawBall to include smoke trail
export function drawBall(ctx, ball) {
    // Draw the smoke trail before drawing the ball
    drawSmokeTrail(ctx);

    // Add a smoke particle to the trail behind the ball if rally count >= maxRallyBeforeSmoke
    if (rallyCount >= maxRallyBeforeSmoke) {
        addSmokeTrail(ball.x, ball.y);
    }

    // Draw the ball
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
