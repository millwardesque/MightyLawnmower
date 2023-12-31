export type Coord2D = {
  x: number;
  y: number;
};

export type GameState = 'splash-screen' | 'running' | 'game-over';

export type Tile = 'dirt' | 'grass' | 'lava';

export type TileFillMode = Tile;

export type TileGrid = Array<Array<Tile>>;
