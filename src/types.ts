export type Coord2D = {
  x: number;
  y: number;
};

export type Tile = 'dirt' | 'grass';

export type TileGrid = Array<Array<Tile>>;
