import { computeGridCell } from './utils';

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