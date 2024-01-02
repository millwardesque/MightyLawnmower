import { Tile } from './types';
import {
  changeTile,
  cloneGrid,
  computeGridCell,
  generateGameTiles,
} from './utils';

const GRID_LEFT = 2;
const GRID_RIGHT = 66;
const GRID_TOP = 2;
const GRID_BOTTOM = 66;

const CELL_WIDTH = 8;
const CELL_HEIGHT = 4;

const GRID_TOP_LEFT = { x: GRID_LEFT, y: GRID_TOP };
const GRID_BOTTOM_RIGHT = { x: GRID_RIGHT, y: GRID_BOTTOM };
const CELL_DIMENSIONS = { x: CELL_WIDTH, y: CELL_HEIGHT };

const CELL_LEFT = 0;
const CELL_RIGHT = Math.floor((GRID_RIGHT - 1 - GRID_LEFT) / CELL_WIDTH);
const CELL_TOP = 0;
const CELL_BOTTOM = Math.floor((GRID_BOTTOM - 1 - GRID_TOP) / CELL_HEIGHT);

describe('changeTile', () => {
  it('preserves all elements in the grid except the one specified', () => {
    const columns = 3;
    const rows = 3;
    const startTile = 'grass';
    const mockGrid = generateGameTiles(columns, rows, startTile);
    const updatedTile = 'dirt';
    const updatedX = 1;
    const updatedY = 1;

    for (let x = 0; x < columns; ++x) {
      for (let y = 0; y < columns; ++y) {
        expect(mockGrid[x][y]).toBe(startTile);
      }
    }

    const newGrid = changeTile(
      { x: updatedX, y: updatedY },
      updatedTile,
      mockGrid
    );
    for (let x = 0; x < columns; ++x) {
      for (let y = 0; y < columns; ++y) {
        if (x === updatedX && y === updatedY) {
          expect(newGrid[x][y]).toBe(updatedTile);
        } else {
          expect(newGrid[x][y]).toBe(startTile);
        }
      }
    }
  });

  it('throws an error if any position outside of the grid is specified', () => {
    const columns = 3;
    const rows = 3;
    const startTile = 'grass';
    const mockGrid = generateGameTiles(columns, rows, startTile);

    expect(() =>
      changeTile({ x: columns + 1, y: rows + 1 }, 'dirt', mockGrid)
    ).toThrow();
  });
});

describe('cloneGrid', () => {
  it('creates a copy of a populated grid', () => {
    const columns = 3;
    const rows = 3;
    const startTile = 'grass';
    const mockGrid = generateGameTiles(columns, rows, startTile);
    const clonedGrid = cloneGrid(mockGrid);

    for (let x = 0; x < columns; ++x) {
      for (let y = 0; y < columns; ++y) {
        expect(clonedGrid[x][y]).toBe(mockGrid[x][y]);
      }
    }
  });

  it("doesn't change the original grid when the cloned grid is modified", () => {
    const columns = 3;
    const rows = 3;
    const startTile = 'grass';
    const updatedTile = 'dirt';
    const testX = 1;
    const testY = 1;
    const mockGrid = generateGameTiles(columns, rows, startTile);
    const clonedGrid = cloneGrid(mockGrid);

    clonedGrid[testX][testY] = updatedTile;

    expect(mockGrid[testX][testY]).toBe(startTile);
    expect(clonedGrid[testX][testY]).toBe(updatedTile);
  });

  it('creates an empty array of the provided grid is also empty', () => {
    const mockGrid = new Array<Array<Tile>>();
    const clonedGrid = cloneGrid(mockGrid);
    expect(clonedGrid.length).toBe(0);
  });
});

describe('computeGridCell', () => {
  test.each([
    { x: GRID_LEFT - 1, y: GRID_TOP - 1 },
    { x: GRID_LEFT - 1, y: GRID_TOP + 1 },
    { x: GRID_LEFT + 1, y: GRID_TOP - 1 },
    { x: GRID_LEFT + 1, y: GRID_BOTTOM },
    { x: GRID_RIGHT, y: GRID_TOP + 1 },
    { x: GRID_RIGHT, y: GRID_BOTTOM },
  ])(
    'returns undefined if the click position %j is outside of the grid',
    (clickCoord) => {
      expect(
        computeGridCell(
          clickCoord,
          GRID_TOP_LEFT,
          GRID_BOTTOM_RIGHT,
          CELL_DIMENSIONS
        )
      ).toBeUndefined();
    }
  );

  test.each([
    [
      { x: GRID_LEFT, y: GRID_TOP },
      { x: CELL_LEFT, y: CELL_TOP },
    ],
    [
      { x: GRID_RIGHT - 1, y: GRID_TOP },
      { x: CELL_RIGHT, y: CELL_TOP },
    ],
    [
      { x: GRID_RIGHT - 1, y: GRID_BOTTOM - 1 },
      { x: CELL_RIGHT, y: CELL_BOTTOM },
    ],
    [
      { x: GRID_LEFT, y: GRID_BOTTOM - 1 },
      { x: CELL_LEFT, y: CELL_BOTTOM },
    ],
  ])(
    'returns the correct grid cell when the position %j is inside the grid',
    (clickCoord, expectedCell) => {
      expect(
        computeGridCell(
          clickCoord,
          GRID_TOP_LEFT,
          GRID_BOTTOM_RIGHT,
          CELL_DIMENSIONS
        )
      ).toEqual(expectedCell);
    }
  );
});

describe('expandGrid', () => {
  test.todo('throw an error is a negative size is requested');
  test.todo('returns the same grid if the a size of zero is requested');
  test.todo(
    'increases the size of the grid by the specified amount in all directions'
  );
  test.todo('fills in the new cells with the request type');
  test.todo(
    'shifts all existing cells down and to the right by the specified amount'
  );
});
