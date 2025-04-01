let startTime, endTime, timeout;
let canClickGreen = false;

const testArea = document.getElementById("testArea");
const highScoreDisplay = document.getElementById("highScore");

// 🔹 Récupération du High Score
let highScore = localStorage.getItem("highScore");
highScore = highScore ? parseInt(highScore, 10) : null;
if (highScore) {
    highScoreDisplay.textContent = `Best Time: ${highScore} ms 🏆`;
}

testArea.addEventListener("click", () => {
    if (testArea.style.backgroundColor === "green" && canClickGreen) {
        // ✅ Calcul du temps de réaction
        endTime = Date.now();
        
        if (startTime) {
            const reactionTime = endTime - startTime;
            console.log(`Start: ${startTime}, End: ${endTime}, Reaction Time: ${reactionTime} ms`);

            // 🎯 Affichage du résultat
            testArea.textContent = `⏱️ ${reactionTime} ms`;

            // 🔹 Mise à jour du High Score
            if (!highScore || reactionTime < highScore) {
                highScore = reactionTime;
                localStorage.setItem("highScore", highScore);
                highScoreDisplay.textContent = `Best Time: ${highScore} ms 🏆`;
            }
        }

        // 🔄 Désactivation des clics multiples
        canClickGreen = false;

        // 🔄 Réinitialisation après 1 sec
        setTimeout(() => {
            testArea.style.backgroundColor = "gray";
            testArea.textContent = "Click to Start";
        }, 1000);

    } else if (testArea.textContent === "Click to Start" || testArea.style.backgroundColor === "gray") {
        // ✅ Démarrage du test
        testArea.textContent = "Wait for green...";
        testArea.style.backgroundColor = "red";

        // ⏳ Délai aléatoire (1-5 sec)
        const delay = Math.floor(Math.random() * 4000) + 1000;
        timeout = setTimeout(() => {
            testArea.style.backgroundColor = "green";
            testArea.textContent = "Click Now!";
            startTime = Date.now(); // ⏳ Démarrage du chrono
            canClickGreen = true; // 🔹 Autorise un seul clic sur le vert
        }, delay);

    } else {
        // ❌ Empêche de cliquer trop tôt
        clearTimeout(timeout);
        testArea.textContent = "Too soon! Wait for green.";
        testArea.style.backgroundColor = "gray";

        // 🔄 Réinitialisation après 1.5 sec
        setTimeout(() => {
            testArea.textContent = "Click to Start";
        }, 1500);
    }
});