import React, { useState, useEffect } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver.jsx";
import Button from "./components/Button.jsx";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  return gameTurns.length % 2 === 0 ? "X" : "O";
}

function deriveWinner(gameBoard, players) {
  for (const combinations of WINNING_COMBINATIONS) {
    const [a, b, c] = combinations;
    if (
      gameBoard[a.row][a.column] &&
      gameBoard[a.row][a.column] === gameBoard[b.row][b.column] &&
      gameBoard[a.row][a.column] === gameBoard[c.row][c.column]
    ) {
      return players[gameBoard[a.row][a.column]];
    }
  }
  return null;
}

function deriveGameBoard(gameTurns) {
  const gameBoard = [...INITIAL_GAME_BOARD.map((arr) => [...arr])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function getRandomEmptySquare(gameBoard) {
  const emptySquares = [];
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if (!gameBoard[i][j]) {
        emptySquares.push({ row: i, col: j });
      }
    }
  }
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [gameMode, setGameMode] = useState("player"); // Default mode is against another player

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    if (gameMode === "ai" && activePlayer === "O" && !winner && !hasDraw) {
      const aiMoveTimeout = setTimeout(() => {
        const emptySquare = getRandomEmptySquare(gameBoard);
        handleSelectSquare(emptySquare.row, emptySquare.col, "O");
      }, 1000); // Adjust the delay (in milliseconds) here
      return () => clearTimeout(aiMoveTimeout); // Clear timeout on component unmount
    }
  }, [gameTurns, gameMode, activePlayer, gameBoard, winner, hasDraw]);

  function handleSelectSquare(rowIdx, colIdx, player = activePlayer) {
    if (!gameBoard[rowIdx][colIdx] && !winner && !hasDraw) {
      setGameTurns((prevTurns) => [
        ...prevTurns,
        { square: { row: rowIdx, col: colIdx }, player },
      ]);
    }
  }

  function handleReset() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));
  }

  return (
    <main>
      <div
        id="game-mode-buttons"
        style={{ display: "flex", justifyContent: "center" }}
        className="choose-container"
      >
        <Button primary onClick={() => setGameMode("player")}>
          Play Against Player
        </Button>
        <Button onClick={() => setGameMode("ai")}>Play Against AI</Button>
      </div>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} reset={handleReset} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
