import React from 'react';

export const GameOverScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <h1>Game over!</h1>
      <div>{children}</div>
    </div>
  );
};
