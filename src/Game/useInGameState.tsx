import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useGameStateStore } from './GameStateStore';
import { useInGameStore } from './InGameStore';
import { useScoreStore } from './ScoreStore';
import { Coord2D } from './types';
import { changeTile, expandGrid, isGameOver } from './utils';

const CELLS_PER_EXPANSION = 1;
const EXPAND_GRID_MULTIPLE = 10; // @DEBUG 10;
const GRASS_GROW_TIMER_REDUCTION = 0.9;

type UseInGameStateReturn = {
  onCellClick: (cellCoords: Coord2D) => void;
  resetGame: () => void;
};

export function useInGameState(): UseInGameStateReturn {
  const { setState: setGameState } = useGameStateStore(
    useShallow((state) => ({
      setState: state.setState,
    }))
  );

  const { increaseScore, resetScore, score } = useScoreStore(
    useShallow((state) => ({
      increaseScore: state.increaseScore,
      resetScore: state.resetScore,
      score: state.score,
    }))
  );

  const {
    gameTiles,
    resetEverything: resetInGameStore,
    scaleGrassTimer,
    setGameTiles,
    shouldExpandGrid,
    setShouldExpandGrid,
  } = useInGameStore(
    useShallow(
      ({
        gameTiles,
        grassTimer,
        resetEverything,
        scaleGrassTimer,
        setGameTiles,
        shouldExpandGrid,
        setShouldExpandGrid,
      }) => ({
        gameTiles,
        grassTimer,
        resetEverything,
        scaleGrassTimer,
        setGameTiles,
        shouldExpandGrid,
        setShouldExpandGrid,
      })
    )
  );

  const onCellClick = useCallback(
    (cellCoords: Coord2D) => {
      const tile = gameTiles[cellCoords.x][cellCoords.y];

      if (tile === 'grass') {
        increaseScore(1);

        const updatedGrid = changeTile(cellCoords, 'dirt', gameTiles);
        setGameTiles(updatedGrid);
        scaleGrassTimer(GRASS_GROW_TIMER_REDUCTION);
      } else if (tile === 'dirt') {
        const updatedGrid = changeTile(cellCoords, 'lava', gameTiles);
        setGameTiles(updatedGrid);
        scaleGrassTimer(GRASS_GROW_TIMER_REDUCTION);
      }
    },
    [gameTiles, increaseScore, scaleGrassTimer, setGameTiles]
  );

  useEffect(
    function checkIfShouldExpandGrid() {
      if (score > 0 && score % EXPAND_GRID_MULTIPLE === 0) {
        setShouldExpandGrid(true);
      }
    },
    [score, setShouldExpandGrid]
  );

  useEffect(
    function onExpandGrid() {
      if (shouldExpandGrid) {
        setShouldExpandGrid(false);

        const newGameTiles = expandGrid(gameTiles, CELLS_PER_EXPANSION, 'dirt');
        setGameTiles(newGameTiles);
      }
    },
    [gameTiles, setGameTiles, shouldExpandGrid, setShouldExpandGrid]
  );

  useEffect(
    function checkForGameOver() {
      if (isGameOver(gameTiles)) {
        setGameState('game-over');
      }
    },
    [gameTiles, setGameState]
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
