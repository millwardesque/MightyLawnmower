import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';

import { Stack } from '../UI/Stack';
import { GameHeader } from './GameHeader';
import { useGameStateStore } from './GameStateStore';
import { useInGameStore } from './InGameStore';
import { useScoreStore } from './ScoreStore';
import { DirtTile, GrassTile, LavaTile } from './tiles';
import { Coord2D, TileGrid } from './types';
import { useInGameState } from './useInGameState';
import {
  changeTile,
  computeGridCell,
  expandGrid,
  getTileGridDimensions,
} from './utils';

const CELL_SIZE_IN_PX = 48;
const CELL_DIMENSIONS = { x: CELL_SIZE_IN_PX, y: CELL_SIZE_IN_PX };
const CELLS_PER_EXPANSION = 1;
const EXPAND_GRID_MULTIPLE = 10;

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

export const InGameScreen: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { score, resetScore } = useScoreStore(
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

  const { gameTiles, grassTimer, setGameTiles } = useInGameStore(
    useShallow(({ gameTiles, grassTimer, setGameTiles, setGrassTimer }) => ({
      gameTiles,
      grassTimer,
      setGameTiles,
      setGrassTimer,
    }))
  );

  const { onCellClick, resetGame } = useInGameState();

  const [shouldExpandGrid, setShouldExpandGrid] = useState(false);

  useEffect(
    function resetOnMount() {
      resetGame();
    },
    [resetGame]
  );

  useEffect(
    function generateGrassTimer() {
      const timer = setInterval(function growGrassOnRandomTile() {
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
    if (isGameOver(gameTiles)) {
      setGameState('game-over');
    }
  }, [gameTiles, setGameState]);

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

      handleGameCanvasClick(gridRef.current, clickEvent, onCellClick);
    },
    [onCellClick]
  );

  const cells = renderGameTiles(gameTiles);
  const gridDimensions = getTileGridDimensions(gameTiles);

  return (
    <Stack gap={8}>
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
    </Stack>
  );
};

function handleGameCanvasClick(
  gameCanvasElement: HTMLDivElement,
  clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  onCellClick: (cellCoords: Coord2D) => void
): void {
  const canvasRect = gameCanvasElement.getBoundingClientRect();
  const { topLeftCorner, bottomRightCorner } =
    getCornersFromDomRect(canvasRect);
  const clickPosition = { x: clickEvent.clientX, y: clickEvent.clientY };

  const clickedCell = computeGridCell(
    clickPosition,
    topLeftCorner,
    bottomRightCorner,
    CELL_DIMENSIONS
  );

  if (clickedCell === undefined) {
    throw new Error(
      `User clicked on the grid at (${clickPosition.x}, ${clickPosition.y}), but the computed grid cell is undefined`
    );
  }

  onCellClick(clickedCell);
}

function getCornersFromDomRect(rect: DOMRect): {
  bottomRightCorner: Coord2D;
  topLeftCorner: Coord2D;
} {
  const topLeftCorner = {
    x: rect.left,
    y: rect.top,
  };
  const bottomRightCorner = {
    x: rect.right,
    y: rect.bottom,
  };

  return {
    bottomRightCorner,
    topLeftCorner,
  };
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
