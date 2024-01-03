import React from 'react';
import styled from 'styled-components';

import { useScoreStore } from './ScoreStore';
import { Score } from './Score';
import { useGameStateStore } from './GameStateStore';
import { Button } from './Button';

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
