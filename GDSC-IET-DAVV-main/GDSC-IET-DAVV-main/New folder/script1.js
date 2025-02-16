document.addEventListener("DOMContentLoaded", function () {
    const showRulesBtn = document.getElementById("show-rules");
    const rulesPopup = document.getElementById("game-rules");
    const closeBtn = document.querySelector(".close-btn");

    // Show the rules popup
    showRulesBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        rulesPopup.style.display = "flex";
    });

    // Close the popup
    closeBtn.addEventListener("click", function () {
        rulesPopup.style.display = "none";
    });

    // Close if clicked outside the content box
    rulesPopup.addEventListener("click", function (event) {
        if (event.target === rulesPopup) {
            rulesPopup.style.display = "none";
        }
    });
});
