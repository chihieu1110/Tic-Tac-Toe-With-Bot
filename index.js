const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");
const boardSizeInput = document.getElementById("boardSize");
const startGameButton = document.getElementById("startGame");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let gameBoard = [];
let boardSize = 3;
let isSinglePlayer = false;
let gameOver = false;

const createBoard = (size) => {
    board.innerHTML = "";
    board.style.setProperty("--board-size", size);
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoard = Array.from({ length: size }, () => Array(size).fill(""));
    gameOver = false;
    currentPlayer = "X";

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement("div");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", handleCellClick);
            board.appendChild(cell);
        }
    }

    board.classList.add("disabled");
    updateStatus(`Player ${currentPlayer}'s turn`);
};

const updateStatus = (message) => {
    statusDisplay.textContent = message;
};

const handleCellClick = (event) => {
    const row = +event.target.dataset.row;
    const col = +event.target.dataset.col;

    if (gameOver || gameBoard[row][col] !== "" || (isSinglePlayer && currentPlayer === "O")) return;

    makeMove(row, col);
    if (!gameOver && isSinglePlayer && currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
};

const botMove = () => {
    if (gameOver) return;
    const bestMove = findBestMove();
    if (bestMove) {
        makeMove(bestMove.row, bestMove.col);
    }
};

const findBestMove = () => boardSize > 4 ? getRandomMove() : minimaxMove();

const getRandomMove = () => {
    const emptyCells = getEmptyCells();
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const minimaxMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j] === "") {
                gameBoard[i][j] = "O";
                const score = minimax(gameBoard, 0, false);
                gameBoard[i][j] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }
    return bestMove;
};

const minimax = (board, depth, isMaximizing) => {
    const maxDepth = 5;
    if (depth >= maxDepth || checkWinner("O") || checkWinner("X")) {
        return evaluateBoard(board, depth);
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === "") {
                board[i][j] = isMaximizing ? "O" : "X";
                const score = minimax(board, depth + 1, !isMaximizing);
                board[i][j] = "";
                bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
            }
        }
    }
    return bestScore;
};

const evaluateBoard = (board, depth) => {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    return 0;
};

const checkWinner = (player) => {
    for (let i = 0; i < boardSize; i++) {
        if (gameBoard[i].every(cell => cell === player) || gameBoard.every(row => row[i] === player)) {
            return true;
        }
    }
    if (gameBoard.every((_, e) => gameBoard[e][e] === player)) return true;
    if (gameBoard.every((_, e) => gameBoard[e][boardSize - 1 - e] === player)) return true;

    return false;
};

const makeMove = (row, col) => {
    gameBoard[row][col] = currentPlayer;
    const cell = board.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cell.textContent = currentPlayer;
    cell.classList.add(`player-${currentPlayer}`);

    if (checkWinner(currentPlayer)) {
        updateStatus(`Player ${currentPlayer} wins!`);
        endGame();
    } else if (gameBoard.flat().every(cell => cell !== "")) {
        updateStatus("It's a draw!");
        endGame();
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatus(`Player ${currentPlayer}'s turn`);
    }
};

const getEmptyCells = () => {
    const emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j] === "") emptyCells.push({ row: i, col: j });
        }
    }
    return emptyCells;
};

const endGame = () => {
    gameOver = true;
    board.querySelectorAll("div").forEach(cell => cell.removeEventListener("click", handleCellClick));
    board.classList.add("disabled");
};

const checkMode = () => {
    const modeElement = document.getElementById("currentMode");
    modeElement.textContent = isSinglePlayer ? "Bot Mode" : "2-Player Mode";
};

startGameButton.addEventListener("click", () => {
    boardSize = parseInt(boardSizeInput.value);
    if (boardSize < 3) {
        alert("Board size must be at least 3x3. Defaulting to 3x3.");
        const inputSize = document.getElementById("boardSize")
        inputSize.value = 3
        boardSize = 3
    }
    document.querySelector("h1").textContent = `Tic Tac Toe - ${boardSize} x ${boardSize}`;
    isSinglePlayer = confirm("Play against the bot? (Cancel for 2-player mode)");
    createBoard(boardSize);
    board.classList.remove("disabled");
    startGameButton.style.display = "none";
    checkMode();
});

restartButton.addEventListener("click", () => {
    createBoard(boardSize);
    startGameButton.style.display = "inline";
    updateStatus("Select board size and click Start Game.");
    checkMode();
});

document.addEventListener("DOMContentLoaded", () => createBoard(boardSize));
