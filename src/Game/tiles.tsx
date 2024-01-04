import styled from 'styled-components';

export const CellTile = styled.div<{
  $cellColumn: number;
  $cellRow: number;
}>`
  /** Adds +1 for 1-based CSS grid */
  grid-column: ${({ $cellColumn }) => $cellColumn + 1};
  grid-row: ${({ $cellRow }) => $cellRow + 1};
`;

export const DirtTile = styled(CellTile)`
  background-color: tan;
`;

export const GrassTile = styled(CellTile)`
  background-color: green;
`;

export const LavaTile = styled(CellTile)`
  background-color: orange;
`;
