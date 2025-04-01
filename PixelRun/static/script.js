let player = document.getElementById("player");
let computer = document.getElementById("computer");
let finishLine = document.getElementById("finish-line");
let startButton = document.getElementById("start");
let restartButton = document.getElementById("restart");

let playerPosition = 0; 
let computerPosition = 0; 
let gameStarted = false; 
let computerInterval; 
let distanceInterval; 

function movePlayer() {
  player.style.left = `${playerPosition}px`;
}

function moveComputer() {
  if (!gameStarted) return;
  let speed = Math.random() * (5.0 - 4.0) + 4.0; 
  computerPosition += speed;
  computer.style.left = `${computerPosition}px`;

  if (computerPosition >= finishLine.offsetLeft - computer.offsetWidth) {
    endGame("L'ordinateur a gagné !");
  }
}

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

  startDistanceTracking(); 
});

restartButton.addEventListener("click", () => {
  gameStarted = false;
  clearInterval(computerInterval);
  stopDistanceTracking(); 
  playerPosition = 0;
  computerPosition = 0;
  player.style.left = "0px";
  computer.style.left = "0px";
  startButton.disabled = false;
  restartButton.disabled = true;
});

function startDistanceTracking() {
  distanceInterval = setInterval(updateDistance, 100); 
}

function stopDistanceTracking() {
  clearInterval(distanceInterval);
}

function updateDistance() {
  let distance = playerPosition - computerPosition;
  let distanceInMeters = (distance / 100).toFixed(2); 
  const distanceDisplay = document.getElementById("score");

  if (distance >= 0) {
    distanceDisplay.textContent = `+${distanceInMeters} m`; 
  } else {
    distanceDisplay.textContent = `${distanceInMeters} m`;
  }
}

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

document.addEventListener("mousedown", () => {
  if (gameStarted) {
    playerPosition += 22; 
    if (playerPosition > finishLine.offsetLeft - player.offsetWidth) {
      playerPosition = finishLine.offsetLeft - player.offsetWidth;
    }
    movePlayer();
    updateDistance(); 

    if (playerPosition >= finishLine.offsetLeft - player.offsetWidth) {
      endGame("Vous avez gagné !");
    }
  }
});

function updateBestScores(newScore) {
  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

  bestScores.push(newScore);
  bestScores.sort((a, b) => b - a); 
  bestScores = bestScores.slice(0, 3);

  localStorage.setItem("bestScores", JSON.stringify(bestScores));
  displayBestScores();
}

function displayBestScores() {
  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  let bestScoresList = document.getElementById("best-scores");

  bestScoresList.innerHTML = ""; 
  bestScores.forEach(score => {
    let li = document.createElement("li");
    let scoreInMeters = (score / 100).toFixed(2);
    li.textContent = `${scoreInMeters} m`;    
    bestScoresList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", displayBestScores);

let helpMessages = [
  "Astuce : Concentre toi !",
  "Astuce : Plus tu es rapide, plus tu as de chances de gagner !",
  "Astuce : Tu n'auras pas plus d'aide.",
  "Astuce : Non",
  "Astuce : Le clic n'est pas la solution. Il faut TENIR bon !",
];

let helpIndex = 0;
let helpClickCount = 0; 
let helpButton = document.getElementById("help");
let helpContainer = document.createElement("div");
helpContainer.id = "help-container";
document.body.appendChild(helpContainer);

helpButton.addEventListener("click", () => {
  helpClickCount++; 

  if (helpIndex === 4 && helpClickCount < 10) {
    helpIndex = 0; 
  }

  helpContainer.textContent = helpMessages[helpIndex];
  helpContainer.style.display = "flex";

  helpIndex = (helpIndex + 1) % helpMessages.length; 

  setTimeout(() => {
    helpContainer.style.display = "none"; 
  }, 1300);

  helpButton.disabled = true; 

setTimeout(() => {
  helpContainer.style.display = "none"; 
  helpButton.disabled = false; 
}, 1300);
});

