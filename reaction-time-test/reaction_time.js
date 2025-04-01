let startTime, endTime, timeout;
let canClickGreen = false;
let topScores = JSON.parse(localStorage.getItem("topScores")) || []; // Récupérer les scores ou initialiser un tableau vide

const highScoreDisplay = document.getElementById("highScore");
const testArea = document.getElementById("testArea");
const scoreboard = document.getElementById("scoreboard");
const resetButton = document.getElementById("resetButton");

if (topScores.length > 0) {
    displayTopScores();
}

// Fonction pour afficher les scores
function displayTopScores() {
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = ""; // Vider la liste des scores

    topScores.forEach((score, index) => {
        const scoreItem = document.createElement("div");
        scoreItem.classList.add("score-item");
        scoreItem.textContent = `#${index + 1}: ${score} ms`;
        scoreList.appendChild(scoreItem);
    });
}

// Fonction pour réinitialiser les scores
resetButton.addEventListener("click", () => {
    topScores = []; // Réinitialiser le tableau des scores
    localStorage.removeItem("topScores"); // Supprimer les scores du localStorage
    displayTopScores(); // Mettre à jour l'affichage des scores
});

testArea.addEventListener("click", () => {
    if (testArea.textContent === "Trop tôt ! Attendez le vert.") {
        testArea.textContent = "Cliquer pour commencer";
        testArea.style.backgroundColor = "gray";
        clearTimeout(timeout);
        return;
    }

    if (testArea.style.backgroundColor === "green" && canClickGreen) {
        endTime = performance.now();
        const reactionTime = Math.round(endTime - startTime);  // Arrondi à la ms près

        testArea.textContent = `⏱️ ${reactionTime} ms`;

        // Ajout du score dans le tableau des meilleurs scores
        topScores.push(reactionTime);
        topScores.sort((a, b) => a - b); // Trier les scores par ordre croissant

        // Garder uniquement les 3 meilleurs scores
        if (topScores.length > 3) {
            topScores.pop();
        }

        // Sauvegarder les scores dans localStorage
        localStorage.setItem("topScores", JSON.stringify(topScores));

        // Afficher le Top 3
        displayTopScores();

        canClickGreen = false;

        setTimeout(() => {
            testArea.style.backgroundColor = "gray";
            testArea.textContent = "Cliquer pour commencer";
        }, 5000);
    } else if (testArea.textContent === "Cliquer pour commencer" || testArea.style.backgroundColor === "gray") {
        testArea.textContent = "Attendez le vert...";
        testArea.style.backgroundColor = "red";

        const delay = Math.floor(Math.random() * 7000) + 1000;
        timeout = setTimeout(() => {
            testArea.style.backgroundColor = "green";
            testArea.textContent = "Cliquez !";
            startTime = performance.now();
            canClickGreen = true;
        }, delay);
    } else {
        if (testArea.textContent !== "Trop tôt ! Attendez le vert.") {
            testArea.textContent = "Trop tôt ! Attendez le vert.";
            testArea.style.backgroundColor = "gray";
            clearTimeout(timeout);
        }
    }
});