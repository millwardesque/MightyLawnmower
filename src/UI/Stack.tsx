import styled from 'styled-components';

const StyledStack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  ${({ $gap }) => ($gap !== undefined ? `gap: ${$gap}px;` : '')}
`;

export const Stack: React.FC<{ children: React.ReactNode; gap: number }> = ({
  children,
  gap,
}) => {
  return <StyledStack $gap={gap}>{children}</StyledStack>;
};
