let player = document.getElementById("player");
let computer = document.getElementById("computer");
let finishLine = document.getElementById("finish-line");
let startButton = document.getElementById("start");
let restartButton = document.getElementById("restart");

let playerPosition = 0; // Position du joueur
let computerPosition = 0; // Position de l'ordinateur
let gameStarted = false; // Le jeu est-il en cours ?
let computerInterval; // Stocke l'intervalle de déplacement de l'ordinateur

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
});

// Fonction de réinitialisation du jeu
restartButton.addEventListener("click", () => {
  gameStarted = false;
  clearInterval(computerInterval);
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
  alert(message);
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

// Clic gauche pour avancer par petits incréments légèrement augmentés
document.addEventListener("mousedown", () => {
  if (gameStarted) {
    playerPosition += 22; // Déplacement par clic légèrement augmenté
    if (playerPosition > finishLine.offsetLeft - player.offsetWidth) {
      playerPosition = finishLine.offsetLeft - player.offsetWidth;
    }
    movePlayer();

    if (playerPosition >= finishLine.offsetLeft - player.offsetWidth) {
      endGame("Vous avez gagné !");
    }
  }
});
