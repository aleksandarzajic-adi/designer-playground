import type { Meta, StoryObj } from '@storybook/react';
import { NavigationButton } from '@dp/ui';

const meta: Meta<typeof NavigationButton> = {
  title: 'Components/NavigationButton',
  component: NavigationButton,
  args: { children: 'NavigationButton' },
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
    type: { control: 'select', options: ['small', 'medium'] }
  },
};

export default meta;
type Story = StoryObj<typeof NavigationButton>;

export const Default: Story = {};
export const DirectionColumn: Story = { args: { direction: 'column' } };
export const DirectionRow: Story = { args: { direction: 'row' } };
export const TypeSmall: Story = { args: { type: 'small' } };
export const TypeMedium: Story = { args: { type: 'medium' } };

