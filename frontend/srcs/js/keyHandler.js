// frontend/srcs/js/keyHandler.js
export const keys = {};

export function handleKeydown(e) {
    keys[e.key] = true;
}

export function handleKeyup(e) {
    keys[e.key] = false;
}

export function updatePaddleDirection(paddleLeft, speed) {
    if (keys['ArrowUp'])
        paddleLeft.dy = -speed;
    else if (keys['ArrowDown'])
        paddleLeft.dy = speed;
    else
        paddleLeft.dy = 0;
}
