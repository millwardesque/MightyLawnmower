import React from 'react';
import { Button } from './Button';
import { Title } from './Title';
import { useGameStateStore } from './GameStateStore';
import { Stack } from './Stack';
import { GameHeader } from './GameHeader';

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
