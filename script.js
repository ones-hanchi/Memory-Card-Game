
const emojis = [
    "🍎", "🍌", "🍇", "🍓",
    "🍊", "🍉", "🍍", "🥝"
];
const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const pairsDisplay = document.getElementById("pairs");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let lockBoard = false;
let gameStarted = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    const allCards = shuffle([...emojis, ...emojis]);

    gameBoard.innerHTML = "";

    allCards.forEach((emoji) => {
        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${emoji}</div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);
    });

    cards = document.querySelectorAll(".card");
}

function startTimer() {
    if (gameStarted) return;

    gameStarted = true;

    timerInterval = setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");
    }, 1000);
}

function flipCard(card) {
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    startTimer();

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;
        pairsDisplay.textContent = `${matchedPairs}/8`;

        flippedCards = [];

        if (matchedPairs === 8) {
            endGame();
        }
    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);

    message.textContent =
        ` Congratulations! You won in ${moves} moves!`;
}

function restartGame() {
    clearInterval(timerInterval);

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    lockBoard = false;
    gameStarted = false;

    movesDisplay.textContent = "0";
    timerDisplay.textContent = "00:00";
    pairsDisplay.textContent = "0/8";
    message.textContent = "";

    createCards();
}

restartButton.addEventListener("click", restartGame);

createCards();
