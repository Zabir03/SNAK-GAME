// ===============================
// 🎯 DOM ELEMENTS
// ===============================
const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const resetButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');


// ===============================
// ⚙️ GAME CONFIG
// ===============================
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);


// ===============================
// 🧠 GAME STATE
// ===============================
let highScore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00-00`; 

let intervalId = null;
let timeIntervalId = null;

let food = { 
    x: Math.floor(Math.random() * rows), 
    y: Math.floor(Math.random() * cols) 
};

const blocks = [];

let snake = [{
    x: 4,
    y: 7
}];

let direction = 'up';

highScoreElement.innerText = highScore;


// ===============================
// 🧱 BOARD CREATION
// ===============================
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}


// ===============================
// 🎮 GAME RENDER LOGIC
// ===============================
function render() {
    let head = null;

    // Food render
    const CurrentfoodBlock = blocks[`${food.x}-${food.y}`];
    if (CurrentfoodBlock) {
        CurrentfoodBlock.classList.add("food");
    }

    // Movement logic
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }

    // Game Over check
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // Clear snake
    snake.forEach((segment) => {
        const block = blocks[`${segment.x}-${segment.y}`];
        if (block) {
            block.classList.remove("fill");
        }
    });

    snake.unshift(head);

    // Food consumption
    if (head.x === food.x && head.y === food.y) {

        const OldfoodBlock = blocks[`${food.x}-${food.y}`];
        if (OldfoodBlock) {
            OldfoodBlock.classList.remove("food");
        }

        food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols) 
        };

        const newfoodBlock = blocks[`${food.x}-${food.y}`];
        if (newfoodBlock) {
            newfoodBlock.classList.add("food");
        }

        score += 10;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    } 
    else {
        snake.pop();
    }

    // Draw snake
    snake.forEach((segment) => {
        const block = blocks[`${segment.x}-${segment.y}`];
        if (block) {
            block.classList.add("fill");
        }
    });
}


// ===============================
// ▶️ START GAME
// ===============================
startButton.addEventListener("click", () => {
    modal.style.display = "none";

    intervalId = setInterval(() => {
        render();
    }, 300);

    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);

        if (sec === 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        time = `${min}-${sec}`;
        timeElement.innerText = time;

    }, 1000);
});


// ===============================
// 🔄 RESET GAME
// ===============================
resetButton.addEventListener("click", restartGame);

function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food");

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    score = 0;
    time = `00-00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    modal.style.display = "none";

    direction = "down";

    snake = [{
        x: 4,
        y: 7
    }];

    food = { 
        x: Math.floor(Math.random() * rows), 
        y: Math.floor(Math.random() * cols) 
    };

    clearInterval(intervalId);

    intervalId = setInterval(() => {
        render();
    }, 300);
}


// ===============================
// 🎮 CONTROLS
// ===============================
addEventListener("keydown", (event) => {

    if (event.key === "ArrowUp") {
        direction = "up";
    }
    else if (event.key === "ArrowDown") {
        direction = "down";
    }
    else if (event.key === "ArrowRight") {
        direction = "right";
    }
    else if (event.key === "ArrowLeft") {
        direction = "left";
    }

});