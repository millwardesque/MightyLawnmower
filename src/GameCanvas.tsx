import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { changeTile, computeGridCell } from './utils';
import { DirtTile, GrassTile } from './tiles';
import { Tile, TileGrid } from './types';
import { Score } from './Score';

const CELL_SIZE_IN_PX = 48;
const NUM_ROWS = 3;
const NUM_COLUMNS = 3;
const GRASS_GROW_TIMER_DURATION = 1000;

const GameCanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px dashed #f00;
`;

const GameCanvasGridContainer = styled.div`
  display: flex;
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

const Button = styled.div`
  background-color: grey;
  padding: 8px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`;

export const GameCanvas: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameTiles, setGameTiles] = useState<TileGrid>(
    generateGameTiles(NUM_COLUMNS, NUM_ROWS, 'dirt')
  );

  const resetGame = useCallback(() => {
    setGameTiles(generateGameTiles(NUM_COLUMNS, NUM_ROWS, 'dirt'));
    setScore(0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const x = Math.floor(Math.random() * NUM_COLUMNS);
      const y = Math.floor(Math.random() * NUM_ROWS);

      const currentTile = gameTiles[x][y];
      if (currentTile === 'dirt') {
        changeTile({ x, y }, 'grass', gameTiles, setGameTiles);
      }
    }, GRASS_GROW_TIMER_DURATION);

    return () => {
      clearInterval(timer);
    };
  }, [gameTiles, setGameTiles]);

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
        score,
        setScore
      );
    },
    [gameTiles, setGameTiles, score, setScore]
  );

  const cells = renderGameTiles(gameTiles);

  return (
    <GameCanvasContainer>
      <Header>
        <Score score={score} />
        <Button onClick={resetGame}>Reset</Button>
      </Header>
      <GameCanvasGridContainer ref={gridRef}>
        <GameCanvasGrid
          $numColumns={NUM_COLUMNS}
          $numRows={NUM_ROWS}
          onClick={onGameCanvasClick}
        >
          {cells}
        </GameCanvasGrid>
      </GameCanvasGridContainer>
    </GameCanvasContainer>
  );
};

function handleGameCanvasClick(
  gameCanvasElement: HTMLDivElement,
  clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  gameTiles: TileGrid,
  setGameTiles: (newGameTiles: TileGrid) => void,
  score: number,
  setScore: (newScore: number) => void
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

  if (clickedCell !== undefined) {
    if (gameTiles[clickedCell.x][clickedCell.y] === 'grass') {
      changeTile(clickedCell, 'dirt', gameTiles, setGameTiles);
      setScore(score + 1);
    }
  }
}

function renderGameTiles(gameTiles: TileGrid): Array<React.ReactNode> {
  const cells: Array<React.ReactNode> = [];
  for (let row = 0; row < NUM_ROWS; ++row) {
    for (let column = 0; column < NUM_COLUMNS; ++column) {
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

function generateGameTiles(
  columns: number,
  rows: number,
  startTile: Tile
): TileGrid {
  return new Array(columns).fill(new Array(rows).fill(startTile));
}
