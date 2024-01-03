import React from 'react';

import styled from 'styled-components';
import { useGameStateStore } from './GameStateStore';
import { Stack } from './Stack';
import { Button } from './Button';

const TitleText = styled.h1`
  margin: 0;
`;

export const GameStartScreen: React.FC = () => {
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Stack gap={8}>
      <TitleText>Mighty Lawnmower</TitleText>
      <Button onClick={() => setGameState('running')}>Start</Button>
    </Stack>
  );
};
