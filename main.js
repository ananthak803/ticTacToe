// Variables to track game state
let currentPlayer = 'X'; // Current player, starting with 'X' (Human)
let gameActive = true; // Boolean to track if the game is active
let gameState = ['', '', '', '', '', '', '', '', '']; // Array to track the board state
const computerPlayer = 'O'; // Computer player
const humanPlayer = 'X'; // Human player

// Winning combinations
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal lines
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical lines
    [0, 4, 8], [2, 4, 6] // Diagonal lines
];

// Function to handle cell clicks for the human player
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // If the cell is already occupied or the game is not active, do nothing
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the cell and the game state for the human move
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Check if there's a winner or a draw after the human move
    if (checkWinner()) {
        gameActive = false;
        alert(`Player ${currentPlayer} has won!`);
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        gameActive = false;
        alert("It's a draw!");
        return;
    }

    // Switch to the computer's turn
    currentPlayer = computerPlayer;
    makeComputerMove();
}

// Function for the computer to make a move using Minimax algorithm
function makeComputerMove() {
    const bestMove = getBestMove(gameState, computerPlayer);
    gameState[bestMove] = computerPlayer;

    // Update the corresponding cell in the DOM
    const computerMoveCell = document.querySelector(`.box[data-cell-index="${bestMove}"]`);
    computerMoveCell.textContent = computerPlayer;

    // Check if the computer's move wins the game
    if (checkWinner()) {
        gameActive = false;
        alert(`Player ${computerPlayer} has won!`);
        return;
    }

    // Check if the game is a draw after the computer move
    if (gameState.every(cell => cell !== '')) {
        gameActive = false;
        alert("It's a draw!");
        return;
    }

    // Switch back to the human player's turn
    currentPlayer = humanPlayer;
}

// Function to check for a winner
function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            return true;
        }
    }
    return false;
}

// Function to evaluate the board for the Minimax algorithm
function evaluateBoard(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === computerPlayer ? +10 : -10;
        }
    }
    return 0;
}

// Minimax algorithm implementation
function minimax(newBoard, player) {
    const availableMoves = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (evaluateBoard(newBoard) === 10) return { score: 10 };
    if (evaluateBoard(newBoard) === -10) return { score: -10 };
    if (availableMoves.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let move = {};
        move.index = availableMoves[i];
        newBoard[move.index] = player;

        if (player === computerPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, computerPlayer);
            move.score = result.score;
        }

        newBoard[move.index] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === computerPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Function to get the best move using Minimax
function getBestMove(board, player) {
    const bestMove = minimax(board, player);
    return bestMove.index;
}

// Function to handle game restart
function restartGame() {
    gameActive = true;
    currentPlayer = humanPlayer;
    gameState = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.box').forEach(cell => cell.textContent = '');
}

// Adding event listeners to the cells
document.querySelectorAll('.box').forEach((cell, index) => {
    cell.setAttribute('data-cell-index', index);
    cell.addEventListener('click', handleCellClick);
});

// Adding event listener to the reset button
document.getElementById('resetButton').addEventListener('click', restartGame);

// Start the game automatically with the player as 'X'
function startGame() {
    gameActive = true;
    currentPlayer = humanPlayer; // Player is 'X'
    gameState = ['', '', '', '', '', '', '', '', '']; // Reset the board state
    document.querySelectorAll('.box').forEach(cell => cell.textContent = '');
}

// Initialize the game on page load
startGame();
