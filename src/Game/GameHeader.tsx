import React from 'react';
import styled from 'styled-components';

import { Button } from '../UI/Button';
import { useGameStateStore } from './GameStateStore';
import { Score } from './Score';
import { useScoreStore } from './ScoreStore';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`;

export const GameHeader: React.FC<{
  grassTimer?: number;
  showReset: boolean;
}> = ({ grassTimer, showReset }) => {
  const score = useScoreStore((state) => state.score);
  const setGameState = useGameStateStore((state) => state.setState);

  return (
    <Header>
      <Score score={score} />
      {grassTimer !== undefined && <div>{grassTimer}s</div>}
      {showReset && (
        <Button onClick={() => setGameState('running')}>Reset</Button>
      )}
    </Header>
  );
};
