import React from 'react';
import styled from 'styled-components';

import { GameOverScreen } from './GameOverScreen';
import { GameStartScreen } from './GameStartScreen';
import { useGameStateStore } from './GameStateStore';
import { InGameScreen } from './InGameScreen';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px dashed #f00;
  min-width: 600px;
  align-content: center;
`;

export const Game: React.FC = () => {
  const gameState = useGameStateStore((state) => state.state);

  return (
    <GameContainer>
      {gameState === 'splash-screen' && <GameStartScreen />}
      {gameState === 'running' && <InGameScreen />}
      {gameState === 'game-over' && <GameOverScreen />}
    </GameContainer>
  );
};
