import type { Meta, StoryObj } from '@storybook/react';
import { NavigationPill } from '@dp/ui';

const meta: Meta<typeof NavigationPill> = {
  title: 'Components/NavigationPill',
  component: NavigationPill,
  args: { children: 'NavigationPill' },
};

export default meta;
type Story = StoryObj<typeof NavigationPill>;

export const Default: Story = {};


