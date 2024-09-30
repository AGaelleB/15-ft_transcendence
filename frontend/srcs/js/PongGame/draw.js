// frontend/srcs/js/PongGame/draw.js

import { rallyCount, maxRallyBeforeSmoke } from './rallyEffect.js';

let smokeTrail = [];
let explosionParticles = [];

export function getSmokeTrail() {
    return smokeTrail;
}

export function setSmokeTrail(newTrail) {
    smokeTrail = newTrail;
}

const maxSmokeParticles = 10;

// Function to calculate a reasonable size for the smoke trail based on ball size
function getSmokeSize(ball) {
    return ball.size * 0.6; // Set to 60% of ball size to keep the trail small but proportional
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
        ctx.arc(particle.x, particle.y, smokeSize, 0, Math.PI * 2); // Use consistent smoke size
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

function addExplosionParticles(x, y) {
    const numberOfParticles = 20; // Number of particles to generate per explosion

    for (let i = 0; i < numberOfParticles; i++) {
        explosionParticles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2, // Random size between 2 and 6
            color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
            dx: (Math.random() - 0.5) * 5, // Random horizontal velocity
            dy: (Math.random() - 0.5) * 5, // Random vertical velocity
            opacity: 1.0,
            fadeRate: Math.random() * 0.05 + 0.02 // Random fade rate
        });
    }
}

// Function to update and draw explosion particles
function drawExplosionParticles(ctx) {
    explosionParticles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Fade out particle over time
        particle.opacity -= particle.fadeRate;

        // Draw particle as a small circle
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Remove particle if it is fully transparent
        if (particle.opacity <= 0) {
            explosionParticles.splice(index, 1);
        }
    });
}

export function drawBall(ctx, ball) {
    // Stop drawing smoke trail and switch to psychedelic effect after 25 exchanges
    // if (rallyCount >= 15 && rallyCount <= 18) {
    //     drawPsychedelicBall(ctx, ball);
    // }
    // else {
        // Draw smoke trail with consistent and proportional size before 25 exchanges
        drawSmokeTrail(ctx, ball);

        // if (rallyCount >= maxRallyBeforeSmoke && rallyCount <= 17)
            // addSmokeTrail(ball.x, ball.y);
        // else if (rallyCount >= 18)
        if (rallyCount >= 3)
            addExplosionParticles(ball.x, ball.y);

        // Draw normal yellow ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
        ctx.closePath();
    // }
}

// Function to draw the psychedelic ball effect
function drawPsychedelicBall(ctx, ball) {
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
