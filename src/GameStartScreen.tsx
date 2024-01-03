import React from 'react';

import { Title } from './Title';

import { useGameStateStore } from './GameStateStore';
import { Stack } from './Stack';
import { Button } from './Button';

export const GameStartScreen: React.FC = () => {
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Stack gap={8}>
      <Title>Mighty Lawnmower</Title>
      <Button onClick={() => setGameState('running')}>Start</Button>
    </Stack>
  );
};
