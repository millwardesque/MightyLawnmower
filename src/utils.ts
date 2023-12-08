import { Coord2D, Tile, TileGrid } from './types';

export function computeGridCell(
  clickCoord: Coord2D,
  gridTopLeft: Coord2D,
  gridBottomRight: Coord2D,
  cellDimensions: Coord2D
): Coord2D | undefined {
  const isXOutside =
    clickCoord.x < gridTopLeft.x || clickCoord.x >= gridBottomRight.x;
  const isYOutside =
    clickCoord.y < gridTopLeft.y || clickCoord.y >= gridBottomRight.y;
  if (isXOutside || isYOutside) {
    return undefined;
  }

  const normalizedX = clickCoord.x - gridTopLeft.x;
  const normalizedY = clickCoord.y - gridTopLeft.y;

  const cellX = Math.floor(normalizedX / cellDimensions.x);
  const cellY = Math.floor(normalizedY / cellDimensions.y);

  return { x: cellX, y: cellY };
}

export function changeTile(
  position: Coord2D,
  newValue: Tile,
  tileGrid: TileGrid,
  setTileGrid: (newTileGrid: TileGrid) => void
): void {
  // @TODO This is way more complicated than I should be and I can't figure out why...
  const columnData = [...tileGrid[position.x]];
  columnData[position.y] = newValue;

  const newGrid = [...tileGrid];
  newGrid[position.x] = columnData;
  setTileGrid(newGrid);
}
