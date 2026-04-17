import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from '@dp/ui';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  args: { children: 'ButtonGroup' },
  argTypes: {
    align: { control: 'select', options: ['justify', 'start', 'end', 'center', 'stack'] }
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {};
export const AlignJustify: Story = { args: { align: 'justify' } };
export const AlignStart: Story = { args: { align: 'start' } };
export const AlignEnd: Story = { args: { align: 'end' } };
export const AlignCenter: Story = { args: { align: 'center' } };
export const AlignStack: Story = { args: { align: 'stack' } };

