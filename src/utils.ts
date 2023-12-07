import { Coord2D } from './types';

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
