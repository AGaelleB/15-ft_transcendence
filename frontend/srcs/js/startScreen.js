// frontend/srcs/js/startScreen.js

document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const textContainer = document.createElement("div");

    textContainer.classList.add('welcome-text');

    textContainer.innerHTML = `
        <h1>Welcome to our game!</h1>
        <h1>Start a new game!</h1>
    `;

    body.appendChild(textContainer);
});
