let isRedLight = false;
let isGameOver = false;
let isGameStarted = false;
let isMovingRight = false;
let isMovingLeft = false;
let touchMoveInterval = null;  // To handle continuous movement on touch

let character = document.getElementById("character");

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let playerSpeed = isMobile ? 3 : 20; // Lower speed for mobile
let isAlertShown = false;

let redLightSound = document.getElementById("redLightSound");
let greenLightSound = document.getElementById("greenLightSound");
let winSound = document.getElementById("winSound");

let guard1Image = document.getElementById("guard1").querySelector("img");

function startGame() {
    if (isGameOver || isGameStarted) return;
    isGameStarted = true;
    document.getElementById("game-status").innerText = "Game Started!";

    if (redLightInterval) clearInterval(redLightInterval);
    redLightGreenLight();
    gameLoop();
}

function moveCharacter() {
    let currentLeft = parseInt(window.getComputedStyle(character).left);
    let finishLine = document.querySelector(".goal-character").offsetLeft;

    if (isMovingRight && currentLeft + playerSpeed < finishLine - 10) {
        character.style.left = `${currentLeft + playerSpeed}px`;
    }

    if (isMovingLeft && currentLeft - playerSpeed >= 0) {
        character.style.left = `${currentLeft - playerSpeed}px`;
    }

    if (currentLeft >= finishLine - 50) {
        endGame("You Won! 🎉");
    }

    if (isRedLight && (isMovingRight || isMovingLeft)) {
        if (!isAlertShown) {
            setTimeout(() => {
                if (!isGameOver) {
                    endGame("You moved on RED LIGHT! Game Over.");
                }
            }, 500);
        }
    }
}

let redLightInterval;

function redLightGreenLight() {
    let gameText = document.getElementById("game-status");
    isRedLight = !isRedLight;
    updateLightState(gameText);

    if (redLightInterval) clearInterval(redLightInterval);
    redLightInterval = setInterval(() => {
        if (isGameOver) return;
        isRedLight = !isRedLight;
        updateLightState(gameText);
    }, Math.random() * (5000 - 3000) + 3000);
}

function updateLightState(gameText) {
    gameText.innerText = isRedLight ? "RED LIGHT" : "GREEN LIGHT";
    gameText.style.color = isRedLight ? "red" : "green";
    toggleSignalLights();
    playLightSound();
}

function toggleSignalLights() {
    document.getElementById("signal1-red").style.opacity = isRedLight ? 1 : 0;
    document.getElementById("signal2-red").style.opacity = isRedLight ? 1 : 0;
    document.getElementById("signal1-green").style.opacity = isRedLight ? 0 : 1;
    document.getElementById("signal2-green").style.opacity = isRedLight ? 0 : 1;
    guard1Image.src = isRedLight ? "assets/guard1frontward.png" : "assets/guard1backward.png";
}

function playLightSound() {
    if (isRedLight) {
        redLightSound.currentTime = 0;
        redLightSound.play();
        greenLightSound.pause();
    } else {
        greenLightSound.currentTime = 0;
        greenLightSound.play();
        redLightSound.pause();
    }
}

// Keyboard Controls
document.addEventListener("keydown", (event) => {
    if (!isGameStarted || isGameOver) return;
    if (event.key === "ArrowRight") isMovingRight = true;
    if (event.key === "ArrowLeft") isMovingLeft = true;
});

document.addEventListener("keyup", (event) => {
    if (!isGameStarted) return;
    if (event.key === "ArrowRight") isMovingRight = false;
    if (event.key === "ArrowLeft") isMovingLeft = false;
});

// Mobile Touch Controls
document.addEventListener("touchstart", (event) => {
    if (!isGameStarted || isGameOver) return;
    isMovingRight = true;
    startTouchMove();
});

document.addEventListener("touchend", () => {
    isMovingRight = false;
    stopTouchMove();
});

// Start movement when touch begins
function startTouchMove() {
    if (touchMoveInterval) return;
    touchMoveInterval = setInterval(() => {
        if (isGameStarted && !isGameOver) {
            moveCharacter();
        }
    }, 50); // Adjust interval for smooth movement
}

// Stop movement when touch ends
function stopTouchMove() {
    clearInterval(touchMoveInterval);
    touchMoveInterval = null;
}

// Button Controls for Mobile
["mousedown", "touchstart"].forEach(event => {
    document.getElementById("move-right").addEventListener(event, () => {
        if (!isGameStarted || isGameOver) return;
        isMovingRight = true;
        startTouchMove();
    });
});

["mouseup", "touchend"].forEach(event => {
    document.getElementById("move-right").addEventListener(event, () => {
        isMovingRight = false;
        stopTouchMove();
    });
});

function gameLoop() {
    if (isGameStarted && !isGameOver) {
        moveCharacter();
        requestAnimationFrame(gameLoop);
    }
}

function endGame(message) {
    if (isGameOver) return;
    isGameOver = true;
    isAlertShown = true;

    if (message.includes("You Won")) {
        winSound.currentTime = 0;
        winSound.play();

        // Generate a unique token
        let token = generateToken();

        // Store token in localStorage (or send to backend)
        localStorage.setItem("secureFormToken", token);

        // Redirect to protected page
        setTimeout(() => {
            window.location.href = `protected.html?token=${token}`;
        }, 1000);
    }

    redLightSound.pause();
    greenLightSound.pause();

    setTimeout(() => {
        alert(message);
    }, 100);

    document.getElementById("signal1-red").style.opacity = 1;
    document.getElementById("signal2-red").style.opacity = 1;
    document.getElementById("signal1-green").style.opacity = 0;
    document.getElementById("signal2-green").style.opacity = 0;

    if (!message.includes("You Won")) {
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Function to generate a unique token
function generateToken() {
    return btoa(Date.now() + Math.random().toString(36).substring(7));
}
isGameStarted = false;
