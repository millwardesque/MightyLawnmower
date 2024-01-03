import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import {
  changeTile,
  computeGridCell,
  expandGrid,
  generateGameTiles,
  getTileGridDimensions,
} from './utils';
import { useScoreStore } from './ScoreStore';
import { useGameStateStore } from './GameStateStore';
import { DirtTile, GrassTile, LavaTile } from './tiles';
import { TileGrid } from './types';
import { GameOverScreen } from './GameOverScreen';
import { GameStartScreen } from './GameStartScreen';
import { GameHeader } from './GameHeader';
const CELL_SIZE_IN_PX = 48;
const CELLS_PER_EXPANSION = 1;
const EXPAND_GRID_MULTIPLE = 10;
const INITIAL_NUM_ROWS = 3;
const INITIAL_NUM_COLUMNS = 3;
const GRASS_GROW_TIMER_INITIAL_DURATION = 3000;
const GRASS_GROW_TIMER_REDUCTION = 0.9;

const GameCanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px dashed #f00;
  min-width: 600px;
  align-content: center;
`;

const GameCanvasGridContainer = styled.div`
  display: flex;
  align-self: center;
`;

const GameCanvasGrid = styled.div<{ $numColumns: number; $numRows: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $numColumns }) => `${$numColumns}, ${CELL_SIZE_IN_PX}px`}
  );
  grid-template-rows: repeat(
    ${({ $numRows }) => `${$numRows}, ${CELL_SIZE_IN_PX}px`}
  );

  cursor: default;
`;

export const GameCanvas: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { score, increaseScore, resetScore } = useScoreStore(
    useShallow((state) => ({
      score: state.score,
      increaseScore: state.increaseScore,
      resetScore: state.resetScore,
    }))
  );

  const { state: gameState, setState: setGameState } = useGameStateStore(
    useShallow((state) => ({
      state: state.state,
      setState: state.setState,
    }))
  );

  const [gameTiles, setGameTiles] = useState<TileGrid>(
    generateGameTiles(INITIAL_NUM_COLUMNS, INITIAL_NUM_ROWS, 'dirt')
  );
  const [grassTimer, setGrassTimer] = useState(
    GRASS_GROW_TIMER_INITIAL_DURATION
  );
  const [shouldExpandGrid, setShouldExpandGrid] = useState(false);

  const resetGame = useCallback(() => {
    setGameTiles(
      generateGameTiles(INITIAL_NUM_COLUMNS, INITIAL_NUM_ROWS, 'dirt')
    );
    setGrassTimer(GRASS_GROW_TIMER_INITIAL_DURATION);
    resetScore();
  }, [setGameTiles, setGrassTimer, resetScore]);

  useEffect(
    function resetGameWhenChangingToRunning() {
      if (gameState === 'running') {
        resetGame();
      }
    },
    [gameState, resetGame]
  );

  useEffect(
    function generateGrassTimer() {
      const timer = setInterval(() => {
        const gridDimensions = getTileGridDimensions(gameTiles);
        const x = Math.floor(Math.random() * gridDimensions.x);
        const y = Math.floor(Math.random() * gridDimensions.y);

        const currentTile = gameTiles[x][y];
        if (currentTile === 'dirt') {
          const updatedGrid = changeTile({ x, y }, 'grass', gameTiles);
          setGameTiles(updatedGrid);
        }
      }, grassTimer);

      return () => {
        clearInterval(timer);
      };
    },
    [gameTiles, grassTimer, setGameTiles]
  );

  useEffect(() => {
    if (gameState === 'running' && isGameOver(gameTiles)) {
      setGameState('game-over');
    }
  }, [gameState, gameTiles, setGameState]);

  useEffect(() => {
    if (score > 0 && score % EXPAND_GRID_MULTIPLE === 0) {
      setShouldExpandGrid(true);
    }
  }, [score, setShouldExpandGrid]);

  useEffect(() => {
    if (shouldExpandGrid) {
      const newGameTiles = expandGrid(gameTiles, CELLS_PER_EXPANSION, 'dirt');
      setGameTiles(newGameTiles);
      setShouldExpandGrid(false);
    }
  }, [
    gameState,
    gameTiles,
    setGameTiles,
    shouldExpandGrid,
    setShouldExpandGrid,
  ]);

  const onGameCanvasClick = useCallback(
    (clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (gridRef.current === null) {
        throw new Error(
          'Failed processing click on GameCanvas. Canvas ref is null'
        );
      }

      handleGameCanvasClick(
        gridRef.current,
        clickEvent,
        gameTiles,
        setGameTiles,
        increaseScore,
        grassTimer,
        setGrassTimer
      );
    },
    [gameTiles, increaseScore, setGameTiles, grassTimer, setGrassTimer]
  );

  const cells = renderGameTiles(gameTiles);
  const gridDimensions = getTileGridDimensions(gameTiles);

  return (
    <GameCanvasContainer>
      {gameState === 'splash-screen' && <GameStartScreen />}
      {gameState === 'running' && (
        <>
          <GameHeader grassTimer={grassTimer} showReset={true} />
          <GameCanvasGridContainer ref={gridRef}>
            <GameCanvasGrid
              $numColumns={gridDimensions.x}
              $numRows={gridDimensions.y}
              onClick={onGameCanvasClick}
            >
              {cells}
            </GameCanvasGrid>
          </GameCanvasGridContainer>
        </>
      )}
      {gameState === 'game-over' && <GameOverScreen />}
    </GameCanvasContainer>
  );
};

function handleGameCanvasClick(
  gameCanvasElement: HTMLDivElement,
  clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  gameTiles: TileGrid,
  setGameTiles: (newGameTiles: TileGrid) => void,
  increaseScore: (increment: number) => void,
  grassTimer: number,
  setGrassTimer: (newGrassTimer: number) => void
): void {
  const canvasRect = gameCanvasElement.getBoundingClientRect();

  const topLeftCorner = {
    x: canvasRect.left,
    y: canvasRect.top,
  };
  const bottomRightCorner = {
    x: canvasRect.right,
    y: canvasRect.bottom,
  };
  const clickPosition = { x: clickEvent.clientX, y: clickEvent.clientY };

  const clickedCell = computeGridCell(
    clickPosition,
    topLeftCorner,
    bottomRightCorner,
    { x: CELL_SIZE_IN_PX, y: CELL_SIZE_IN_PX }
  );

  console.log('[CPM] Clicked Cell', {
    clickedCell,
    clickEvent,
    clickPosition,
    topLeftCorner,
    bottomRightCorner,
  }); // @DEBUG

  if (clickedCell !== undefined) {
    if (gameTiles[clickedCell.x][clickedCell.y] === 'grass') {
      const updatedGrid = changeTile(clickedCell, 'dirt', gameTiles);
      setGameTiles(updatedGrid);
      increaseScore(1);
      setGrassTimer(Math.max(100, grassTimer * GRASS_GROW_TIMER_REDUCTION));
    } else if (gameTiles[clickedCell.x][clickedCell.y] === 'dirt') {
      const updatedGrid = changeTile(clickedCell, 'lava', gameTiles);
      setGameTiles(updatedGrid);
      setGrassTimer(Math.max(100, grassTimer * GRASS_GROW_TIMER_REDUCTION));
    }
  }
}

function renderGameTiles(gameTiles: TileGrid): Array<React.ReactNode> {
  const cells: Array<React.ReactNode> = [];
  const gridDimensions = getTileGridDimensions(gameTiles);

  for (let row = 0; row < gridDimensions.y; ++row) {
    for (let column = 0; column < gridDimensions.x; ++column) {
      const content = `${column}, ${row}`;
      if (gameTiles[column][row] === 'grass') {
        cells.push(
          <GrassTile
            key={`${column}, ${row}`}
            $cellRow={row}
            $cellColumn={column}
          >
            {content}
          </GrassTile>
        );
      } else if (gameTiles[column][row] === 'lava') {
        cells.push(
          <LavaTile
            key={`${column}, ${row}`}
            $cellRow={row}
            $cellColumn={column}
          >
            {content}
          </LavaTile>
        );
      } else {
        cells.push(
          <DirtTile
            key={`${column}, ${row}`}
            $cellRow={row}
            $cellColumn={column}
          >
            {content}
          </DirtTile>
        );
      }
    }
  }

  return cells;
}

function isGameOver(gameTiles: TileGrid): boolean {
  return gameTiles.flat().every((tile) => tile !== 'dirt');
}
