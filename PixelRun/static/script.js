let player = document.getElementById("player");
let computer = document.getElementById("computer");
let finishLine = document.getElementById("finish-line");
let startButton = document.getElementById("start");
let restartButton = document.getElementById("restart");

let playerPosition = 0; // Position du joueur
let computerPosition = 0; // Position de l'ordinateur
let gameStarted = false; // Le jeu est-il en cours ?
let computerInterval; // Stocke l'intervalle de déplacement de l'ordinateur
let distanceInterval; // Variable pour stocker l'intervalle de mise à jour de la distance

// Fonction pour déplacer l'emoji du joueur
function movePlayer() {
  player.style.left = `${playerPosition}px`;
}

// Fonction pour déplacer l'ordinateur avec une vitesse légèrement augmentée
function moveComputer() {
  if (!gameStarted) return;
  let speed = Math.random() * (5.0 - 4.0) + 4.0; // Vitesse entre 2.0 et 3.0 px
  computerPosition += speed;
  computer.style.left = `${computerPosition}px`;

  if (computerPosition >= finishLine.offsetLeft - computer.offsetWidth) {
    endGame("L'ordinateur a gagné !");
  }
}

// Fonction de démarrage du jeu
startButton.addEventListener("click", () => {
  gameStarted = true;
  startButton.disabled = true;
  restartButton.disabled = false;
  playerPosition = 0;
  computerPosition = 0;
  player.style.left = "0px";
  computer.style.left = "0px";

  clearInterval(computerInterval);
  computerInterval = setInterval(moveComputer, 20);

  startDistanceTracking(); // Démarre la mise à jour continue de la distance
});

// Fonction de réinitialisation du jeu
restartButton.addEventListener("click", () => {
  gameStarted = false;
  clearInterval(computerInterval);
  stopDistanceTracking(); // Arrête la mise à jour continue de la distance
  playerPosition = 0;
  computerPosition = 0;
  player.style.left = "0px";
  computer.style.left = "0px";
  startButton.disabled = false;
  restartButton.disabled = true;
});

// Fonction de fin de jeu
function endGame(message) {
  gameStarted = false;
  clearInterval(computerInterval);
  stopDistanceTracking(); // Arrête la mise à jour continue de la distance
  alert(message);
}

// Fonction pour démarrer le suivi de la distance
function startDistanceTracking() {
  distanceInterval = setInterval(updateDistance, 100); // Mettre à jour la distance toutes les 100ms
}

// Fonction pour arrêter le suivi de la distance
function stopDistanceTracking() {
  clearInterval(distanceInterval);
}

// Fonction pour mettre à jour la distance entre le joueur et l'ordinateur dans le scoreboard
function updateDistance() {
  let distance = playerPosition - computerPosition;
  let distanceInMeters = (distance / 100).toFixed(2); // Conversion en mètres
  const distanceDisplay = document.getElementById("score");

  if (distance >= 0) {
    distanceDisplay.textContent = `+${distanceInMeters} m`; // Affichage positif
  } else {
    distanceDisplay.textContent = `${distanceInMeters} m`; // Affichage négatif
  }
}


// Drag & Drop du joueur
player.addEventListener("mousedown", (e) => {
  if (!gameStarted) return;
  
  let offsetX = e.clientX - player.offsetLeft;
  
  function onMouseMove(e) {
    if (gameStarted) {
      playerPosition = e.clientX - offsetX;
      if (playerPosition < 0) playerPosition = 0;
      if (playerPosition > finishLine.offsetLeft - player.offsetWidth) {
        playerPosition = finishLine.offsetLeft - player.offsetWidth;
      }
      movePlayer();
    }
  }

  function onMouseUp() {
    if (playerPosition >= finishLine.offsetLeft - player.offsetWidth) {
      endGame("Vous avez gagné !");
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
});

// Fonction pour mettre à jour la distance entre le joueur et l'ordinateur lors du clic
document.addEventListener("mousedown", () => {
  if (gameStarted) {
    playerPosition += 22; // Déplacement par clic légèrement augmenté
    if (playerPosition > finishLine.offsetLeft - player.offsetWidth) {
      playerPosition = finishLine.offsetLeft - player.offsetWidth;
    }
    movePlayer();
    updateDistance(); // Mettre à jour la distance après chaque mouvement du joueur

    if (playerPosition >= finishLine.offsetLeft - player.offsetWidth) {
      endGame("Vous avez gagné !");
    }
  }
});

// Fonction pour mettre à jour les meilleurs scores en localStorage
function updateBestScores(newScore) {
  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

  bestScores.push(newScore);
  bestScores.sort((a, b) => b - a); // Trier par ordre décroissant
  bestScores = bestScores.slice(0, 3); // Garder seulement les 3 meilleurs

  localStorage.setItem("bestScores", JSON.stringify(bestScores));
  displayBestScores();
}

// Fonction pour afficher les meilleurs scores
function displayBestScores() {
  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  let bestScoresList = document.getElementById("best-scores");

  bestScoresList.innerHTML = ""; // Nettoyer l'affichage
  bestScores.forEach(score => {
    let li = document.createElement("li");
    let scoreInMeters = (score / 100).toFixed(2);
    li.textContent = `${scoreInMeters} m`;    
    bestScoresList.appendChild(li);
  });
}

// Met à jour les meilleurs scores à chaque fin de partie
function endGame(message) {
  gameStarted = false;
  clearInterval(computerInterval);
  stopDistanceTracking();
  alert(message);

  let finalDistance = playerPosition - computerPosition;
  updateBestScores(finalDistance);
}

// Afficher les scores au chargement de la page
document.addEventListener("DOMContentLoaded", displayBestScores);

// Afficher les messages d'aide au clic sur le bouton "Aide"
let helpMessages = [
  "Astuce : Concentre toi !",
  "Astuce : Plus tu es rapide, plus tu as de chances de gagner !",
  "Astuce : Tu n'auras pas plus d'aide.",
  "Astuce : Non",
  "Astuce : Le clic n'est pas la solution. Il faut TENIR bon !",
];

let helpIndex = 0;
let helpClickCount = 0; // Compteur de clics sur le bouton "Aide"
let helpButton = document.getElementById("help");
let helpContainer = document.createElement("div");
helpContainer.id = "help-container";
document.body.appendChild(helpContainer);

helpButton.addEventListener("click", () => {
  helpClickCount++; // Incrémente le compteur de clics

  // Vérifie si on doit afficher l'astuce 5 (seulement après 10 clics)
  if (helpIndex === 4 && helpClickCount < 10) {
    helpIndex = 0; // Revenir à la première astuce sans afficher la 5ème
  }

  helpContainer.textContent = helpMessages[helpIndex];
  helpContainer.style.display = "block";

  helpIndex = (helpIndex + 1) % helpMessages.length; // Boucle sur les astuces

  setTimeout(() => {
    helpContainer.style.display = "none"; // Cache la bulle après 3 secondes
  }, 1300);

  helpButton.disabled = true; // Désactive temporairement le bouton

setTimeout(() => {
  helpContainer.style.display = "none"; // Cache la bulle après 3 secondes
  helpButton.disabled = false; // Réactive le bouton après la disparition de la bulle
}, 1300);
});

