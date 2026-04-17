import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { rawTokens } from '@dp/tokens';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
`;

const Swatch = styled.div<{ $value: string }>`
  height: 80px;
  background: ${(p) => p.$value};
  border-radius: 8px;
  border: 1px solid var(--dp-color-border);
`;

const meta: Meta = { title: 'Foundations/Colors' };
export default meta;

export const Light: StoryObj = {
  render: () => (
    <Grid>
      {Object.entries(rawTokens.light)
        .filter(([k]) => k.startsWith('--dp-color-'))
        .map(([k, v]) => (
          <div key={k}>
            <Swatch $value={v as string} />
            <code style={{ fontSize: 12 }}>{k}</code>
          </div>
        ))}
    </Grid>
  ),
};
