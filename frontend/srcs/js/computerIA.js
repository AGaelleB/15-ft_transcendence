// frontend/srcs/js/computerIA.js

export function moveComputerPaddle(ball, paddleRight, canvas, aiSpeed) {
    if (ball.x > canvas.width / 2) {
        const centerOfPaddle = paddleRight.y + paddleRight.height / 2;

        // AI paddle moves at 90% of the player's speed
        if (ball.y > centerOfPaddle)
            paddleRight.y += aiSpeed;
        else
            paddleRight.y -= aiSpeed;

        // Prevent the AI paddle from going out of bounds
        if (paddleRight.y < 0)
            paddleRight.y = 0;
        if (paddleRight.y > canvas.height - paddleRight.height)
            paddleRight.y = canvas.height - paddleRight.height;
    }
}
