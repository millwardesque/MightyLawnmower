import React from 'react';

import styled from 'styled-components';

import { Stack } from './Stack';

const TitleText = styled.h1`
  margin: 0;
`;

export const GameStartScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Stack gap={8}>
      <TitleText>Mighty Lawnmower</TitleText>
      <div>{children}</div>
    </Stack>
  );
};
