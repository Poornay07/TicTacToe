const cells = document.querySelectorAll('.cell');
const difficultySelect = document.getElementById('difficulty');
const turnIndicator = document.getElementById('turnIndicator');
let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
let isPlayerTurn = currentPlayer === 'X';

updateTurnDisplay();

function handleClick(cell) {
  if (!isPlayerTurn || cell.innerText !== '') return;

  cell.innerText = currentPlayer;
  cell.classList.add('disabled');

  if (checkWin(currentPlayer)) {
    showPopup(currentPlayer + ' wins!');
    disableAllCells();
  } else if (isDraw()) {
    showPopup("It's a draw!");
  } else {
    currentPlayer = 'O';
    isPlayerTurn = false;
    updateTurnDisplay();
    bestMove();
  }
}

function bestMove() {
  setTimeout(() => {
    let difficulty = difficultySelect.value;
    let move = null;

    if (difficulty === 'easy') {
      move = getRandomMove();
    } else if (difficulty === 'medium') {
      move = getSmartMove('O') || getSmartMove('X') || getRandomMove();
    } else if (difficulty === 'hard') {
      move = minimaxMove();
    }

    if (move !== null) {
      cells[move].innerText = 'O';
      cells[move].classList.add('disabled');

      if (checkWin('O')) {
        showPopup('O wins!');
        disableAllCells();
      } else if (isDraw()) {
        showPopup("It's a draw!");
      } else {
        currentPlayer = 'X';
        isPlayerTurn = true;
        updateTurnDisplay();
      }
    }
  }, 300);
}

function updateTurnDisplay() {
  turnIndicator.innerText = `Turn: ${currentPlayer}`;
}

function getSmartMove(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    let values = [cells[a].innerText, cells[b].innerText, cells[c].innerText];
    let playerCount = values.filter(val => val === player).length;
    let emptyCount = values.filter(val => val === '').length;

    if (playerCount === 2 && emptyCount === 1) {
      let emptyIndex = pattern[values.indexOf('')];
      return emptyIndex;
    }
  }
  return null;
}

function getRandomMove() {
  let emptySpots = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerText === '') {
      emptySpots.push(i);
    }
  }
  if (emptySpots.length === 0) return null;
  return emptySpots[Math.floor(Math.random() * emptySpots.length)];
}

function minimaxMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerText === '') {
      cells[i].innerText = 'O';
      let score = minimax(false);
      cells[i].innerText = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(isMaximizing) {
  if (checkWin('O')) return 1;
  if (checkWin('X')) return -1;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerText === '') {
        cells[i].innerText = 'O';
        best = Math.max(best, minimax(false));
        cells[i].innerText = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerText === '') {
        cells[i].innerText = 'X';
        best = Math.min(best, minimax(true));
        cells[i].innerText = '';
      }
    }
    return best;
  }
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].innerText === player)
  );
}

function isDraw() {
  return Array.from(cells).every(cell => cell.innerText !== '');
}

function disableAllCells() {
  cells.forEach(cell => cell.classList.add('disabled'));
}

function showPopup(message) {
  document.getElementById('popupMessage').innerText = message;
  document.getElementById('popup').classList.remove('hidden');
}

function restartGame() {
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('disabled');
  });

  currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
  isPlayerTurn = currentPlayer === 'X';
  updateTurnDisplay();

  document.getElementById('popup').classList.add('hidden');

  if (!isPlayerTurn) {
    bestMove();
  }
}

// Start if bot has the first turn
if (!isPlayerTurn) {
  bestMove();
}
