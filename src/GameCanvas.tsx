import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { computeGridCell } from './utils';
import { DirtTile, GrassTile } from './tiles';
import { TileGrid } from './types';

const CELL_SIZE_IN_PX = 48;
const NUM_ROWS = 3;
const NUM_COLUMNS = 3;

const GameCanvasContainer = styled.div`
  display: flex;
  border: 1px dashed #f00;
`;

const GameCanvasGrid = styled.div<{ $numColumns: number; $numRows: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $numColumns }) => `${$numColumns}, ${CELL_SIZE_IN_PX}px`}
  );
  grid-template-rows: repeat(
    ${({ $numRows }) => `${$numRows}, ${CELL_SIZE_IN_PX}px`}
  );
`;

export const GameCanvas: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [gameTiles, setGameTiles] = useState<TileGrid>(
    new Array(NUM_COLUMNS).fill(new Array(NUM_ROWS).fill('grass'))
  );

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
        setGameTiles
      );
    },
    [gameTiles, setGameTiles]
  );

  const cells = renderGameTiles(gameTiles);

  return (
    <GameCanvasContainer ref={gridRef}>
      <GameCanvasGrid
        $numColumns={NUM_COLUMNS}
        $numRows={NUM_ROWS}
        onClick={onGameCanvasClick}
      >
        {cells}
      </GameCanvasGrid>
    </GameCanvasContainer>
  );
};

function handleGameCanvasClick(
  gameCanvasElement: HTMLDivElement,
  clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  gameTiles: TileGrid,
  setGameTiles: (newGameTiles: TileGrid) => void
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
    // @TODO This is way more complicated than I should be and I can't figure out why...
    const column = [...gameTiles[clickedCell.x]];
    column[clickedCell.y] = 'dirt';

    const newGameTiles = [...gameTiles];
    newGameTiles[clickedCell.x] = column;
    setGameTiles(newGameTiles);
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
