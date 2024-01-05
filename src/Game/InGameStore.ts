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
  scaleGrassTimer: (multiplier: number) => void;
  setGrassTimer: (newValue: number) => void;

  shouldExpandGrid: boolean;
  setShouldExpandGrid: (shouldExpandGrid: boolean) => void;

  resetEverything: () => void;
};

export const useInGameStore = create<InGameStore>()((set) => ({
  gameTiles: getInitialGameTiles(),
  setGameTiles: (newGrid) => set(() => ({ gameTiles: newGrid })),

  grassTimer: getInitialGrassTimer(),
  scaleGrassTimer: (multiplier: number) =>
    set((state) => ({
      grassTimer: Math.max(100, state.grassTimer * multiplier),
    })),
  setGrassTimer: (newValue) => set(() => ({ grassTimer: newValue })),

  shouldExpandGrid: false,
  setShouldExpandGrid: (shouldExpandGrid: boolean) =>
    set(() => ({ shouldExpandGrid })),

  resetEverything: () =>
    set(() => ({
      gameTiles: getInitialGameTiles(),
      grassTimer: getInitialGrassTimer(),
      shouldExpandGrid: false,
    })),
}));

function getInitialGrassTimer(): number {
  return GRASS_GROW_TIMER_INITIAL_DURATION;
}

function getInitialGameTiles(): TileGrid {
  return generateGameTiles(INITIAL_NUM_COLUMNS, INITIAL_NUM_ROWS, 'dirt');
}
