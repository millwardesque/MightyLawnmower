import { create } from 'zustand';

import { GameState } from './types';

type GameStateStore = {
  state: GameState;
  setState: (newState: GameState) => void;
};

export const useGameStateStore = create<GameStateStore>()((set) => ({
  state: 'splash-screen',

  setState: (newState) =>
    set(() => ({
      state: newState,
    })),
}));
