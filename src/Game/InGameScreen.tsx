import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';

import { Stack } from '../UI/Stack';
import { InGameHeader } from './InGameHeader';
import { useInGameStore } from './InGameStore';
import { DirtTile, GrassTile, LavaTile } from './tiles';
import { Coord2D, TileGrid } from './types';
import { useInGameState } from './useInGameState';
import { computeGridCell, getTileGridDimensions } from './utils';

const CELL_SIZE_IN_PX = 48;
const CELL_DIMENSIONS = { x: CELL_SIZE_IN_PX, y: CELL_SIZE_IN_PX };

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
  const gameTiles = useInGameStore(({ gameTiles }) => gameTiles);
  const { onCellClick, resetGame } = useInGameState();

  useEffect(
    function resetOnMount() {
      resetGame();
    },
    [resetGame]
  );

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
      <InGameHeader />
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
    getCornersFromDOMRect(canvasRect);
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

function getCornersFromDOMRect(rect: DOMRect): {
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
