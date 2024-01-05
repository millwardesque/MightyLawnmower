import React from 'react';

import { Button } from '../UI/Button';
import { Header } from '../UI/Header';
import { Stack } from '../UI/Stack';
import { Title } from '../UI/Title';
import { useGameStateStore } from './GameStateStore';
import { Score } from './Score';
import { useScoreStore } from './ScoreStore';

export const GameOverScreen: React.FC = () => {
  const score = useScoreStore((state) => state.score);
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Stack gap={8}>
      <Header>
        <Score score={score} />
      </Header>
      <Title>Game over!</Title>
      <Button onClick={() => setGameState('running')}>Reset</Button>
    </Stack>
  );
};
