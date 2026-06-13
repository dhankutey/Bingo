// ==========================================================
// 1. MAIN BINGO GAME LOGIC
// ==========================================================
let gridSize = 5;
let boardState = [];
let gameOver = false;

function initGame(size) {
    gridSize = size;
    gameOver = false;
    document.getElementById('message').textContent = '';
    
    // Reset the UI tracking letters back to default inactive states
    const letters = document.querySelectorAll('.letter');
    letters.forEach(l => l.classList.remove('active'));

    const board = document.getElementById('board');
    board.innerHTML = '';
    
    // Assigns dynamic classes like 'board-5x5', 'board-7x7', 'board-10x10'
    board.className = `bingo-board board-${gridSize}x${gridSize}`;
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Generate consecutive sequential numbers
    const totalNumbers = gridSize * gridSize;
    const numbers = [];
    for (let i = 1; i <= totalNumbers; i++) {
        numbers.push(i);
    }
    
    // Fisher-Yates Algorithm for perfect, non-biased shuffling
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    // Generate a fresh tracking grid matrix initialized to false
    boardState = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

    // Construct the grid elements visually
    for (let i = 0; i < totalNumbers; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = numbers[i];
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener('click', () => handleCellClick(cell, row, col));
        board.appendChild(cell);
    }
}

function handleCellClick(cell, row, col) {
    if (gameOver || boardState[row][col]) return;

    cell.classList.add('marked');
    boardState[row][col] = true;

    const completedLinesCount = countCompletedLines();
    
    // Update the visual status of top indicator letters dynamically
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letterSpan, index) => {
        if (index < completedLinesCount) {
            letterSpan.classList.add('active');
        } else {
            letterSpan.classList.remove('active');
        }
    });

    // Determine lines required to win based on the active grid footprint
    let linesNeededToWin = 5; 
    if (gridSize === 7) linesNeededToWin = 7;
    if (gridSize === 10) linesNeededToWin = 10;

    if (completedLinesCount >= linesNeededToWin) {
        document.getElementById('message').textContent = 'Perfect Bingo! 🎉 Game Completed!';
        gameOver = true;
    }
}

function countCompletedLines() {
    let lines = 0;

    // Row verification check
    for (let r = 0; r < gridSize; r++) {
        if (boardState[r].every(cell => cell)) lines++;
    }

    // Column verification check
    for (let c = 0; c < gridSize; c++) {
        let colWin = true;
        for (let r = 0; r < gridSize; r++) {
            if (!boardState[r][c]) {
                colWin = false;
                break;
            }
        }
        if (colWin) lines++;
    }

    // Top-left to bottom-right diagonal check
    let mainDiagWin = true;
    for (let i = 0; i < gridSize; i++) {
        if (!boardState[i][i]) {
            mainDiagWin = false;
            break;
        }
    }
    if (mainDiagWin) lines++;

    // Top-right to bottom-left diagonal check
    let antiDiagWin = true;
    for (let i = 0; i < gridSize; i++) {
        if (!boardState[i][gridSize - 1 - i]) {
            antiDiagWin = false;
            break;
        }
    }
    if (antiDiagWin) lines++;

    return lines;
}

// ==========================================================
// 2. UI BUTTON SELECTION EVENT LISTENERS WITH CONFIRMATION
// ==========================================================
const sizeButtons = document.querySelectorAll('.size-btn');

sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const chosenSize = parseInt(button.dataset.size);
        
        // Triggers native browser window with "OK" (Confirm) and "Cancel" choices every time
        const userConfirmed = confirm(`Are you sure? Switching to a ${chosenSize}x${chosenSize} grid will reset your progress.`);
        
        // If the user clicks "OK" (true), clear the grid and build the new footprint
        if (userConfirmed) {
            initGame(chosenSize);
        }
        // If they click "Cancel" (false), do nothing and let them continue their match
    });
});

// Launch a default 5x5 game layout automatically on initial load
initGame(5);
