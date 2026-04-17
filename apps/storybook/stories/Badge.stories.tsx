import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Stack } from '@dp/ui';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap={2}>
      <Badge>Neutral</Badge>
      <Badge $tone="accent">Accent</Badge>
      <Badge $tone="success">Success</Badge>
      <Badge $tone="warning">Warning</Badge>
      <Badge $tone="danger">Danger</Badge>
    </Stack>
  ),
};
