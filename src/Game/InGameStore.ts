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
};

export const useInGameStore = create<InGameStore>()((set) => ({
  gameTiles: generateGameTiles(INITIAL_NUM_COLUMNS, INITIAL_NUM_ROWS, 'dirt'),
  setGameTiles: (newGrid) => set(() => ({ gameTiles: newGrid })),

  grassTimer: GRASS_GROW_TIMER_INITIAL_DURATION,
  setGrassTimer: (newValue) => set(() => ({ grassTimer: newValue })),
}));
