import type { Meta, StoryObj } from '@storybook/react';
import { TextContentHeading } from '@dp/ui';

const meta: Meta<typeof TextContentHeading> = {
  title: 'Components/TextContentHeading',
  component: TextContentHeading,
  args: { children: 'TextContentHeading' },
  argTypes: {
    align: { control: 'select', options: ['start', 'center'] }
  },
};

export default meta;
type Story = StoryObj<typeof TextContentHeading>;

export const Default: Story = {};
export const AlignStart: Story = { args: { align: 'start' } };
export const AlignCenter: Story = { args: { align: 'center' } };

