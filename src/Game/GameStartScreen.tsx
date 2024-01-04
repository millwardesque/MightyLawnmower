import React from 'react';

import { Title } from '../UI/Title';

import { useGameStateStore } from './GameStateStore';
import { Stack } from '../UI/Stack';
import { Button } from '../UI/Button';

export const GameStartScreen: React.FC = () => {
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Stack gap={8}>
      <Title>Mighty Lawnmower</Title>
      <Button onClick={() => setGameState('running')}>Start</Button>
    </Stack>
  );
};
