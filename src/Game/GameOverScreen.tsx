import React from 'react';

import { Button } from '../UI/Button';
import { Stack } from '../UI/Stack';
import { Title } from '../UI/Title';
import { GameHeader } from './GameHeader';
import { useGameStateStore } from './GameStateStore';

export const GameOverScreen: React.FC = () => {
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Stack gap={8}>
      <GameHeader showReset={false} />
      <Title>Game over!</Title>
      <Button onClick={() => setGameState('running')}>Reset</Button>
    </Stack>
  );
};
