import { create } from 'zustand';
import { TileGrid } from './types';
import { generateGameTiles } from './utils';

const GRASS_GROW_TIMER_INITIAL_DURATION = 3000;
const INITIAL_NUM_ROWS = 3;
const INITIAL_NUM_COLUMNS = 3;

export type InGameStore = {
  gameTiles: TileGrid;
  setGameTiles: (newGrid: TileGrid) => void;

  grassTimer: number;
  setGrassTimer: (newValue: number) => void;

  resetEverything: () => void;
};

export const useInGameStore = create<InGameStore>()((set) => ({
  gameTiles: getInitialGameTiles(),
  setGameTiles: (newGrid) => set(() => ({ gameTiles: newGrid })),

  grassTimer: getInitialGrassTimer(),
  setGrassTimer: (newValue) => set(() => ({ grassTimer: newValue })),

  resetEverything: () =>
    set(() => ({
      gameTiles: getInitialGameTiles(),
      grassTimer: getInitialGrassTimer(),
    })),
}));

function getInitialGrassTimer(): number {
  return GRASS_GROW_TIMER_INITIAL_DURATION;
}

function getInitialGameTiles(): TileGrid {
  return generateGameTiles(INITIAL_NUM_COLUMNS, INITIAL_NUM_ROWS, 'dirt');
}
