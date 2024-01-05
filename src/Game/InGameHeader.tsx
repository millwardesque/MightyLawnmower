import React, { useCallback } from 'react';

import { Button } from '../UI/Button';
import { Header } from '../UI/Header';
import { useInGameStore } from './InGameStore';
import { Score } from './Score';
import { useScoreStore } from './ScoreStore';
import { useInGameState } from './useInGameState';

export const InGameHeader: React.FC = () => {
  const score = useScoreStore((state) => state.score);
  const grassTimer = useInGameStore(({ grassTimer }) => grassTimer);
  const { resetGame } = useInGameState();

  const onReset = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <Header>
      <Score score={score} />
      <div>{grassTimer}s</div>
      <Button onClick={onReset}>Reset</Button>
    </Header>
  );
};
