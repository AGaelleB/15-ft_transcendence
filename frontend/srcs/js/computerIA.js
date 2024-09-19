// frontend/srcs/js/computerIA.js

function moveComputerPaddle(ball, paddleRight, canvas) {
    if (ball.x > canvas.width / 2) {
        const centerOfPaddle = paddleRight.y + paddleRight.height / 2;
        let targetSpeed = 2;
        if (Math.abs(ball.y - centerOfPaddle) > 50) {
            targetSpeed = 5;
        }

        if (ball.y > centerOfPaddle)
            paddleRight.y += targetSpeed;
        else
            paddleRight.y -= targetSpeed;

        if (paddleRight.y < 0)
            paddleRight.y = 0;
        if (paddleRight.y > canvas.height - paddleRight.height)
            paddleRight.y = canvas.height - paddleRight.height;
    }
}
