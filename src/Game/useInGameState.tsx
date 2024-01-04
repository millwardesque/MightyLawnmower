import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Coord2D } from './types';
import { useInGameStore } from './InGameStore';
import { useScoreStore } from './ScoreStore';
import { changeTile } from './utils';

const GRASS_GROW_TIMER_REDUCTION = 0.9;

type UseInGameStateReturn = {
  onCellClick: (cellCoords: Coord2D) => void;
  resetGame: () => void;
};

export function useInGameState(): UseInGameStateReturn {
  const { increaseScore, resetScore } = useScoreStore(
    useShallow((state) => ({
      increaseScore: state.increaseScore,
      resetScore: state.resetScore,
    }))
  );

  const {
    gameTiles,
    grassTimer,
    resetEverything: resetInGameStore,
    setGameTiles,
    setGrassTimer,
  } = useInGameStore(
    useShallow(
      ({
        gameTiles,
        grassTimer,
        resetEverything,
        setGameTiles,
        setGrassTimer,
      }) => ({
        gameTiles,
        grassTimer,
        resetEverything,
        setGameTiles,
        setGrassTimer,
      })
    )
  );

  const onCellClick = useCallback(
    (cellCoords: Coord2D) => {
      const tile = gameTiles[cellCoords.x][cellCoords.y];

      if (tile === 'grass') {
        const updatedGrid = changeTile(cellCoords, 'dirt', gameTiles);
        setGameTiles(updatedGrid);
        increaseScore(1);
        setGrassTimer(Math.max(100, grassTimer * GRASS_GROW_TIMER_REDUCTION));
      } else if (tile === 'dirt') {
        const updatedGrid = changeTile(cellCoords, 'lava', gameTiles);
        setGameTiles(updatedGrid);
        setGrassTimer(Math.max(100, grassTimer * GRASS_GROW_TIMER_REDUCTION));
      }
    },
    [gameTiles, grassTimer, increaseScore, setGameTiles, setGrassTimer]
  );

  const resetGame = useCallback(() => {
    resetInGameStore();
    resetScore();
  }, [resetInGameStore, resetScore]);

  return {
    onCellClick,
    resetGame,
  };
}
