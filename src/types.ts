export type Coord2D = {
  x: number;
  y: number;
};

export type GameState = 'running' | 'game-over';

export type Tile = 'dirt' | 'grass';

export type TileGrid = Array<Array<Tile>>;
