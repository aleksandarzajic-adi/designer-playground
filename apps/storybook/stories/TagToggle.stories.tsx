import type { Meta, StoryObj } from '@storybook/react';
import { TagToggle } from '@dp/ui';

const meta: Meta<typeof TagToggle> = {
  title: 'Components/TagToggle',
  component: TagToggle,
  args: { children: 'Label' },
};

export default meta;
type Story = StoryObj<typeof TagToggle>;

export const Default: Story = {};


