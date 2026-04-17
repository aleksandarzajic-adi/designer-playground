import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type DialogBodyType = 'card' | 'sheet';

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: DialogBodyType;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  closeIcon?: React.ReactNode;
  showClose?: boolean;
}

const typeStyles = (t: DefaultTheme): Record<DialogBodyType, ReturnType<typeof css>> => ({
  card: css`
    border: 1px solid ${t.colors.border};
    border-radius: ${t.radii.md};
  `,
  sheet: css`
    border: 1px solid ${t.colors.border};
    border-radius: 0;
  `,
});

const Root = styled.div<{ $type: DialogBodyType }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[5]};
  padding: ${(p) => p.theme.spacing[6]};
  background: ${(p) => p.theme.colors.bgPrimary};
  color: ${(p) => p.theme.colors.fgPrimary};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};

  ${(p) => typeStyles(p.theme)[p.$type]}
`;

const Slot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[5]};
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[3]};
`;

const Heading = styled.h2`
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSize.xl};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
  color: ${(p) => p.theme.colors.fgMuted};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing[4]};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${(p) => p.theme.spacing[4]};
  right: ${(p) => p.theme.spacing[4]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[2]};
  background: transparent;
  border: none;
  border-radius: ${(p) => p.theme.radii.lg};
  color: ${(p) => p.theme.colors.fgPrimary};
  cursor: pointer;
  transition: background ${(p) => p.theme.durations.fast} ease;

  &:hover { background: ${(p) => p.theme.colors.bgMuted}; }
  &:focus-visible { outline: 2px solid ${(p) => p.theme.colors.accent}; outline-offset: 2px; }
`;

const DefaultCloseIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  (
    {
      type = 'card',
      heading,
      description,
      actions,
      onClose,
      closeLabel = 'Close',
      closeIcon,
      showClose = true,
      children,
      ...rest
    },
    ref,
  ) => (
    <Root ref={ref} $type={type} role="dialog" {...rest}>
      <Slot>
        {(heading || description) && (
          <TextGroup>
            {heading && <Heading>{heading}</Heading>}
            {description && <Description>{description}</Description>}
          </TextGroup>
        )}
        {children}
        {actions && <ButtonGroup>{actions}</ButtonGroup>}
      </Slot>
      {showClose && onClose && (
        <CloseButton type="button" aria-label={closeLabel} onClick={onClose}>
          {closeIcon ?? DefaultCloseIcon}
        </CloseButton>
      )}
    </Root>
  ),
);
DialogBody.displayName = 'DialogBody';
