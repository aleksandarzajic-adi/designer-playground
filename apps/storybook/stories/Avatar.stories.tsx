import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@dp/ui';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { initials: 'AZ' },
  argTypes: {
    type: { control: 'select', options: ['initial', 'image'] },
    size: { control: 'select', options: ['large', 'small', 'medium'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    type: 'image',
  },
};
export const TypeInitial: Story = { args: { type: 'initial' } };
export const TypeImage: Story = { args: { type: 'image' } };
export const SizeLarge: Story = { args: { size: 'large' } };
export const SizeSmall: Story = { args: { size: 'small' } };
export const SizeMedium: Story = { args: { size: 'medium' } };
export const ShapeCircle: Story = { args: { shape: 'circle' } };
export const ShapeSquare: Story = { args: { shape: 'square' } };
