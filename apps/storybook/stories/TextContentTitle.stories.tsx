import type { Meta, StoryObj } from '@storybook/react';
import { TextContentTitle } from '@dp/ui';

const meta: Meta<typeof TextContentTitle> = {
  title: 'Components/TextContentTitle',
  component: TextContentTitle,
  args: { children: 'TextContentTitle' },
  argTypes: {
    align: { control: 'select', options: ['start', 'center'] }
  },
};

export default meta;
type Story = StoryObj<typeof TextContentTitle>;

export const Default: Story = {};
export const AlignStart: Story = { args: { align: 'start' } };
export const AlignCenter: Story = { args: { align: 'center' } };

