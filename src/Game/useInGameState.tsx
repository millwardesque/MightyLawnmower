import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useInGameStore } from './InGameStore';
import { useScoreStore } from './ScoreStore';
import { Coord2D } from './types';
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
    resetEverything: resetInGameStore,
    scaleGrassTimer,
    setGameTiles,
  } = useInGameStore(
    useShallow(
      ({
        gameTiles,
        grassTimer,
        resetEverything,
        scaleGrassTimer,
        setGameTiles,
      }) => ({
        gameTiles,
        grassTimer,
        resetEverything,
        scaleGrassTimer,
        setGameTiles,
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
        scaleGrassTimer(GRASS_GROW_TIMER_REDUCTION);
      } else if (tile === 'dirt') {
        const updatedGrid = changeTile(cellCoords, 'lava', gameTiles);
        setGameTiles(updatedGrid);
        scaleGrassTimer(GRASS_GROW_TIMER_REDUCTION);
      }
    },
    [gameTiles, increaseScore, scaleGrassTimer, setGameTiles]
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
