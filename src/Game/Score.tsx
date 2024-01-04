import React from 'react';

export const Score: React.FC<{ score: number }> = ({ score }) => {
  return <div>Score: {score}</div>;
};
