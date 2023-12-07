import React from 'react';
import styled from 'styled-components';

const CELL_SIZE_IN_PX = 24;

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
  return (
    <GameCanvasContainer>
      <GameCanvasGrid $numColumns={24} $numRows={16} />
    </GameCanvasContainer>
  );
};
