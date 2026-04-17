import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type TextLinkListDensity = 'default' | 'tight';

export interface TextLinkListItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface TextLinkListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  items: TextLinkListItem[];
  density?: TextLinkListDensity;
}

const densityStyles = (t: DefaultTheme): Record<TextLinkListDensity, ReturnType<typeof css>> => ({
  default: css`
    gap: ${t.spacing[3]};
  `,
  tight: css`
    gap: ${t.spacing[2]};
  `,
});

const titleStyles = (t: DefaultTheme): Record<TextLinkListDensity, ReturnType<typeof css>> => ({
  default: css`
    padding-bottom: ${t.spacing[4]};
  `,
  tight: css`
    padding-bottom: ${t.spacing[1]};
  `,
});

const Root = styled.nav<{ $density: TextLinkListDensity }>`
  display: flex;
  flex-direction: column;
  ${(p) => densityStyles(p.theme)[p.$density]}
`;

const Title = styled.div<{ $density: TextLinkListDensity }>`
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.colors.fgPrimary};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  ${(p) => titleStyles(p.theme)[p.$density]}
`;

const Slot = styled.ul<{ $density: TextLinkListDensity }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  ${(p) => densityStyles(p.theme)[p.$density]}
`;

const Item = styled.li`
  display: flex;
`;

const ItemLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.fgPrimary};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  text-decoration: none;
  border-radius: ${(p) => p.theme.radii.sm};
  transition: color ${(p) => p.theme.durations.fast} ease;

  &:hover {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const TextLinkList = React.forwardRef<HTMLElement, TextLinkListProps>(
  ({ title, items, density = 'default', ...rest }, ref) => (
    <Root ref={ref} $density={density} {...rest}>
      {title && <Title $density={density}>{title}</Title>}
      <Slot $density={density}>
        {items.map((item, index) => (
          <Item key={index}>
            <ItemLink href={item.href} onClick={item.onClick}>
              {item.label}
            </ItemLink>
          </Item>
        ))}
      </Slot>
    </Root>
  ),
);
TextLinkList.displayName = 'TextLinkList';
