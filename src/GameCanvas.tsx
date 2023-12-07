import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { computeGridCell } from './utils';
import { DirtTile, GrassTile } from './tiles';

const CELL_SIZE_IN_PX = 48;
const NUM_ROWS = 16;
const NUM_COLUMNS = 24;

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

  const onGameCanvasClick = useCallback(
    (clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (gridRef.current === null) {
        throw new Error(
          'Failed processing click on GameCanvas. Canvas ref is null'
        );
      }

      handleGameCanvasClick(gridRef.current, clickEvent);
    },
    []
  );

  const cells: Array<React.ReactNode> = [];
  for (let row = 0; row < NUM_ROWS; ++row) {
    for (let column = 0; column < NUM_COLUMNS; ++column) {
      const content = `(${column}, ${row})`;
      if (row % 2 === 0) {
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
  clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>
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

  console.log('[CPM] Grid click', {
    ...clickedCell,
  }); // @DEBUG
}
