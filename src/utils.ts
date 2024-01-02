import { Coord2D, Tile, TileFillMode, TileGrid } from './types';

const MAX_ASSUMED_COLUMNS = 1000;
const MAX_ASSUMED_ROWS = 1000;

export function changeTile(
  position: Coord2D,
  newValue: Tile,
  tileGrid: TileGrid
): TileGrid {
  const newGrid = cloneGrid(tileGrid);
  newGrid[position.x][position.y] = newValue;

  return newGrid;
}

export function cloneGrid(grid: TileGrid): TileGrid {
  const clonedGrid = [...grid];
  clonedGrid.forEach((rowData, x) => {
    clonedGrid[x] = [...rowData];
  });

  return clonedGrid;
}

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

/**
 * Expands the tile grid outward in all directions
 * @param gameTiles
 * @param fillTile
 */
export function expandGrid(
  gameTiles: TileGrid,
  cellsPerEdge: number,
  fillMode: TileFillMode
): TileGrid {
  if (gameTiles[0] === undefined) {
    throw new Error(
      'Error expanding grid: First grid column has uninitialized rows'
    );
  }
  const oldColumnCount = gameTiles.length;
  const oldRowCount = gameTiles[0].length;
  const newColumnCount = oldColumnCount + cellsPerEdge * 2;
  const newRowCount = oldRowCount + cellsPerEdge * 2;

  /**
   * Since we don't want to mutate the original grid, create a grid with all tiles set to the new fill mode
   * and then set internal values accordingly.
   *
   * This is super slow, but easy to grok and the grid is small enough that it won't really matter.
   */
  const newGrid = generateGameTiles(newColumnCount, newRowCount, fillMode);

  for (let x = 0; x < oldColumnCount; x++) {
    for (let y = 0; y < oldRowCount; y++) {
      newGrid[x + cellsPerEdge][y + cellsPerEdge] = gameTiles[x][y];
    }
  }
  return newGrid;
}

export function generateGameTiles(
  columns: number,
  rows: number,
  startTile: Tile
): TileGrid {
  if (columns > MAX_ASSUMED_COLUMNS || rows > MAX_ASSUMED_ROWS) {
    throw new Error(
      `This code is written assuming grids no larger than ${MAX_ASSUMED_COLUMNS} x ${MAX_ASSUMED_ROWS}.  Specified dimensions are ${columns} x ${rows}. Check the code to make sure this is still valid`
    );
  }

  const grid = new Array<Array<Tile>>(columns);
  for (let x = 0; x < columns; ++x) {
    grid[x] = new Array<Tile>(rows).fill(startTile);
  }

  return grid;
}

export function getTileGridDimensions(grid: TileGrid): Coord2D {
  if (grid[0] === undefined) {
    throw new Error(
      'Error getting grid dimensions: First grid column has uninitialized row array'
    );
  }

  return {
    x: grid.length,
    y: grid[0].length,
  };
}
