// Variáveis globais

const dicas = [
  "Tente lembrar onde viu aquele número binário!",
  "Os números decimais estão parecidos? Compare com atenção!",
  "Você pode usar o tempo a seu favor, vá com calma!",
  "Binário é composto por 0 e 1. Lembre-se disso!",
  "Parabéns! Continue assim!",
];

function mostrarMascoteComDica() {
  const mascote = document.getElementById("mascote-helper");
  const fala = document.getElementById("mascote-speech");
  const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
  
  fala.textContent = dicaAleatoria;
  mascote.classList.remove("hidden");

  setTimeout(() => {
    mascote.classList.add("hidden");
  }, 5000); // fica visível por 5 segundos
}

// Exemplo: mostrar mascote a cada 30 segundos
setInterval(mostrarMascoteComDica, 10000);

const gameBoard = document.getElementById("game-board");
const nivelSelect = document.getElementById("nivel");
const timerElement = document.getElementById("timer");
const gameTimerElement = document.getElementById("game-timer");
const statusElement = document.getElementById("status");
const scoreElement = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const playerNameInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");
const finalScoreElement = document.getElementById("final-score");
const highscoresElement = document.getElementById("highscores");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let firstCard = null;
let secondCard = null;
let countdown;
let gameCountdown;
let playerName = "";
let highscores = JSON.parse(localStorage.getItem("highscores")) || [];

// Event Listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// Funções do jogo
function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Por favor, digite seu nome!");
    return;
  }

  playerDisplay.textContent = playerName;
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  setupGame();
}

function restartGame() {
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  setupGame();
}

function setupGame() {
  clearInterval(countdown);
  clearInterval(gameCountdown);
  gameBoard.innerHTML = "";
  statusElement.textContent = "";
  lockBoard = true;
  matchedPairs = 0;
  scoreElement.textContent = "Pares: 0";

  const nivel = parseInt(nivelSelect.value);
  totalPairs = nivel / 2;

  const numeros = [];
  const maxNumber = Math.max(10, totalPairs);
  while (numeros.length < totalPairs) {
    const num = Math.floor(Math.random() * maxNumber) + 1;
    if (!numeros.includes(num)) {
      numeros.push(num);
    }
  }

  const cards = [];
  numeros.forEach(num => {
    cards.push(createCard(num, num, false));
    cards.push(createCard(decimalToBinary(num), num, true));
  });

  // Ajustar grid dinamicamente
  // ajustarGrid(cards.length);

  shuffle(cards).forEach(card => {
    gameBoard.appendChild(card);
    card.classList.add("flipped");
  });

  let tempo = 10;
  timerElement.textContent = `Memorize: ${tempo}s`;

  countdown = setInterval(() => {
    tempo--;
    timerElement.textContent = `Memorize: ${tempo}s`;

    if (tempo === 0) {
      clearInterval(countdown);
      timerElement.textContent = "Jogo começou!";

      const allCards = document.querySelectorAll(".card");
      allCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove("flipped");
          card.dataset.revealed = "false";
          if (index === allCards.length - 1) {
            lockBoard = false;
            startGameTimer();
          }
        }, 100 + index * 50);
      });
    }
  }, 1000);
}

function ajustarGrid(cartaTotal) {
  const minColunas = 3; // Nível mínimo de cartas (3 pares)
  const maxColunas = 5; // Número máximo de colunas que você quer (para 10 pares, por exemplo)
  
  let colunas = Math.ceil(Math.sqrt(cartaTotal));

  // Ajusta o número de colunas para que as cartas sempre caibam no grid, mantendo o tamanho fixo
  if (colunas < minColunas) {
    colunas = minColunas; // Garantir que nunca tenha menos que 3 colunas
  } else if (colunas > maxColunas) {
    colunas = maxColunas; // Garantir que não ultrapasse o limite de 5 colunas
  }

  // Definir o tamanho fixo dos cards, baseado no mínimo número de colunas (3 pares)
  gameBoard.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
  gameBoard.style.gridAutoRows = '1fr'; // Para que as linhas também se ajustem conforme necessário
}


function startGameTimer() {
  let gameTime = 60;
  gameTimerElement.textContent = `Tempo: ${gameTime}s`;

  gameCountdown = setInterval(() => {
    gameTime--;
    gameTimerElement.textContent = `Tempo: ${gameTime}s`;

    if (gameTime === 0) {
      clearInterval(gameCountdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  lockBoard = true;
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScoreElement.textContent = `${playerName}, você encontrou ${matchedPairs} pares!`;
  updateHighscores(playerName, matchedPairs);
  displayHighscores();
}

function updateHighscores(name, score) {
  highscores.push({ name, score });
  highscores.sort((a, b) => b.score - a.score);
  highscores = highscores.slice(0, 5);
  localStorage.setItem("highscores", JSON.stringify(highscores));
}

function displayHighscores() {
  highscoresElement.innerHTML = "";
  highscores.forEach((player, index) => {
    const scoreElement = document.createElement("div");
    scoreElement.className = "highscore-item";
    scoreElement.innerHTML = `
      <span>${index + 1}. ${player.name}</span>
      <span>${player.score} pares</span>
    `;
    highscoresElement.appendChild(scoreElement);
  });
}

function createCard(text, matchValue, isBinary) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.matchValue = matchValue;
  card.dataset.revealed = "true";
  card.dataset.binary = isBinary;

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  cardContent.textContent = text;
  card.appendChild(cardContent);

  card.addEventListener("click", flipCard);
  return card;
}

function flipCard() {
  if (lockBoard || this.dataset.revealed === "true") return;

  this.classList.add("flipped");
  this.dataset.revealed = "true";

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.matchValue === secondCard.dataset.matchValue &&
                  firstCard.dataset.binary !== secondCard.dataset.binary;

  if (isMatch) {
    disableCards();
    matchedPairs++;
    scoreElement.textContent = `Pares: ${matchedPairs}`;
    
    if (matchedPairs === totalPairs) {
      setTimeout(endGame, 1000);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.dataset.revealed = "false";
    secondCard.dataset.revealed = "false";
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function decimalToBinary(num) {
  return num.toString(2);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Exibir highscores ao carregar
displayHighscores();
