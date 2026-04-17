import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type NotificationTone = 'message' | 'alert';

export interface NotificationProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: NotificationTone;
    variant?: NotificationVariant;
}

const toneStyles = (t: DefaultTheme): Record<NotificationTone, ReturnType<typeof css>> => ({
  message: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
  alert: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
});

const Root = styled.span<{ $tone: NotificationTone }>`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing[1]} ${(p) => p.theme.spacing[2]};
  border-radius: ${(p) => p.theme.radii.pill};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: 1;
  ${(p) => toneStyles(p.theme)[p.$tone]}
`;

export const Notification = React.forwardRef<HTMLSpanElement, NotificationProps>(
  ({ tone = 'message', ...rest }, ref) => <Root ref={ref} $tone={tone} {...rest} />,
);
Notification.displayName = 'Notification';

export type NotificationVariant = 'message' | 'alert';
