let isRedLight = false;
let isGameOver = false;
let playerSpeed = 10;  // Adjust player speed for smoother movement
let character = document.getElementById("character");

// Flag to ensure the alert is shown only once
let isAlertShown = false;

// Get sound elements
let redLightSound = document.getElementById("redLightSound");
let greenLightSound = document.getElementById("greenLightSound");

// Reference to the guard's image element
let guard1Image = document.getElementById("guard1").querySelector("img");

// Declare variables to track character movement
let isMovingRight = false;
let isMovingLeft = false;

function startGame() {
    // Hide the start box and start the game immediately
    document.getElementById("game-status").innerText = "Game Started!";
    
    // Start the Red Light Green Light logic immediately
    redLightGreenLight();
    
    // Start the game loop
    gameLoop();
}

function redLightGreenLight() {
    let gameText = document.getElementById("game-status");

    // Immediately change light state without delay
    isRedLight = !isRedLight;
    gameText.innerText = isRedLight ? "RED LIGHT" : "GREEN LIGHT";
    gameText.style.color = isRedLight ? "red" : "green";
    toggleSignalLights();
    
    // Play corresponding sound
    playLightSound();

    setInterval(() => {
        if (isGameOver) return;

        // Switch light after 3-5 seconds interval
        isRedLight = !isRedLight;
        gameText.innerText = isRedLight ? "RED LIGHT" : "GREEN LIGHT";
        gameText.style.color = isRedLight ? "red" : "green";

        // Update the signal lights based on the current light state
        toggleSignalLights();

        // Play corresponding sound
        playLightSound();
    }, Math.random() * (5000 - 3000) + 3000); // Changes every 3-5 seconds
}

function toggleSignalLights() {
    if (isRedLight) {
        // Show red signal and hide green signal
        document.getElementById("signal1-red").style.opacity = 1;
        document.getElementById("signal2-red").style.opacity = 1;
        document.getElementById("signal1-green").style.opacity = 0;
        document.getElementById("signal2-green").style.opacity = 0;

        // Change the guard's image to frontward (red light)
        guard1Image.src = "/assets/guard1frontward.png";
    } else {
        // Show green signal and hide red signal
        document.getElementById("signal1-red").style.opacity = 0;
        document.getElementById("signal2-red").style.opacity = 0;
        document.getElementById("signal1-green").style.opacity = 1;
        document.getElementById("signal2-green").style.opacity = 1;

        // Change the guard's image to backward (green light)
        guard1Image.src = "/assets/guard1backward.png";
    }
}

// Play sound based on the current light state
function playLightSound() {
    if (isRedLight) {
        redLightSound.currentTime = 0; // Reset Red Light sound to the start
        redLightSound.play();  // Play Red Light sound
        greenLightSound.pause();  // Stop Green Light sound
    } else {
        greenLightSound.currentTime = 0; // Reset Green Light sound to the start
        greenLightSound.play();  // Play Green Light sound
        redLightSound.pause();  // Stop Red Light sound
    }
}

document.addEventListener("keydown", (event) => {
    if (isGameOver) return;

    // Start moving the character when the key is pressed
    if (event.key === "ArrowRight") {
        isMovingRight = true;
    }
    if (event.key === "ArrowLeft") {
        isMovingLeft = true;
    }
});

document.addEventListener("keyup", (event) => {
    // Stop moving the character when the key is released
    if (event.key === "ArrowRight") {
        isMovingRight = false;
    }
    if (event.key === "ArrowLeft") {
        isMovingLeft = false;
    }
});

// Function to continuously move the character
function moveCharacter() {
    let currentLeft = parseInt(window.getComputedStyle(character).left);
    let finishLine = document.querySelector(".goal-character").offsetLeft;

    // Move the character continuously to the right
    if (isMovingRight && currentLeft + playerSpeed < finishLine - 10) {
        character.style.left = `${currentLeft + playerSpeed}px`;
    }

    // Move the character continuously to the left
    if (isMovingLeft && currentLeft - playerSpeed >= 0) {
        character.style.left = `${currentLeft - playerSpeed}px`;
    }

    // Check if player reached the finish line (guard)
    if (currentLeft >= finishLine - 50) {
        endGame("You Won! 🎉");
    }

    // Check if the player has moved during a Red Light
    if (isRedLight && (isMovingRight || isMovingLeft)) {
        if (!isAlertShown) {  // Check if the alert has been shown already
            setTimeout(() => {
                if (!isGameOver) {  // Only end the game if not already over
                    endGame("You moved on RED LIGHT! Game Over.");
                }
            }, 500);  // Delay alert by 0.5 seconds
        }
    }
}

// Continuously update character's movement
function gameLoop() {
    if (!isGameOver) {
        moveCharacter();
        requestAnimationFrame(gameLoop);  // Keep calling the game loop for smooth animation
    }
}

// Start the game loop
gameLoop();

// Get win sound element
let winSound = document.getElementById("winSound");




function endGame(message) {
    if (isGameOver) return;  // Prevent multiple game endings

    isGameOver = true;
    isAlertShown = true;  // Mark that the alert has been shown

    // Play win sound **before** showing the alert
    if (message.includes("You Won")) {
        winSound.currentTime = 0; // Reset the win sound
        winSound.play();
    }

    // Stop other sounds immediately
    redLightSound.pause();
    greenLightSound.pause();

    // Show the alert (this will not stop the background music)
    setTimeout(() => {
        alert(message);
    }, 100);  // Delay alert slightly so audio starts first

    // Change signals to red when the game ends (if player loses)
    document.getElementById("signal1-red").style.opacity = 1;
    document.getElementById("signal2-red").style.opacity = 1;
    document.getElementById("signal1-green").style.opacity = 0;
    document.getElementById("signal2-green").style.opacity = 0;

    // Wait for 10 seconds before redirecting if the player wins
    if (message.includes("You Won")) {
        setTimeout(() => {
            window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe08nEmr6eoM56Q2NS5o0tO2Wsl1gS-p1zIUTMUq7WYnplhUw/viewform";
        }, 10000);  // 10-second delay
    } else {
        // Restart game after 3 seconds if the player loses
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}






document.addEventListener("keydown", (event) => {
    if (isGameOver) return;

    // Start moving the character when the key is pressed (for desktop)
    if (event.key === "ArrowRight") {
        isMovingRight = true;
    }
    if (event.key === "ArrowLeft") {
        isMovingLeft = true;
    }
});

document.addEventListener("keyup", (event) => {
    // Stop moving the character when the key is released (for desktop)
    if (event.key === "ArrowRight") {
        isMovingRight = false;
    }
    if (event.key === "ArrowLeft") {
        isMovingLeft = false;
    }
});

// For mobile touch controls
document.addEventListener("touchstart", (event) => {
    if (isGameOver) return;

    // Use touch position for character movement
    const touchX = event.touches[0].clientX;

    if (touchX < window.innerWidth / 2) {
        isMovingLeft = true;  // Move left
    } else {
        isMovingRight = true;  // Move right
    }
});

document.addEventListener("touchend", () => {
    // Stop moving the character when touch ends
    isMovingRight = false;
    isMovingLeft = false;
});

