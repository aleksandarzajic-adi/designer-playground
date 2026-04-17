import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@dp/ui';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger'] }
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const ToneNeutral: Story = { args: { tone: 'neutral' } };
export const ToneAccent: Story = { args: { tone: 'accent' } };
export const ToneSuccess: Story = { args: { tone: 'success' } };
export const ToneWarning: Story = { args: { tone: 'warning' } };
export const ToneDanger: Story = { args: { tone: 'danger' } };

