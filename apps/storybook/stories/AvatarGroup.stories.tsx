import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from '@dp/ui';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  args: { children: 'AvatarGroup' },
  argTypes: {
    spacing: { control: 'select', options: ['overlap', 'spaced'] }
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {};
export const SpacingOverlap: Story = { args: { spacing: 'overlap' } };
export const SpacingSpaced: Story = { args: { spacing: 'spaced' } };

