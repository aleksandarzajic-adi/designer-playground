import type { Meta, StoryObj } from '@storybook/react';
import { NavigationButton } from '@dp/ui';

const meta: Meta<typeof NavigationButton> = {
  title: 'Components/NavigationButton',
  component: NavigationButton,
  args: { children: 'Nav' },
};

export default meta;
type Story = StoryObj<typeof NavigationButton>;

export const Default: Story = {};


