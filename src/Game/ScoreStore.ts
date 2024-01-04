import { create } from 'zustand';

type ScoreStore = {
  score: number;

  increaseScore: (increment: number) => void;
  resetScore: () => void;
};

export const useScoreStore = create<ScoreStore>()((set) => ({
  gameState: 'splash-screen',
  score: 0,

  increaseScore: (increment) =>
    set((state) => ({
      score: state.score + increment,
    })),
  resetScore: () => set(() => ({ score: 0 })),
}));
