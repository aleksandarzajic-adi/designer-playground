import type { Meta, StoryObj } from '@storybook/react';
import { TextList } from '@dp/ui';

const meta: Meta<typeof TextList> = {
  title: 'Components/TextList',
  component: TextList,
  args: { children: 'TextList' },
  argTypes: {
    density: { control: 'select', options: ['default', 'tight'] }
  },
};

export default meta;
type Story = StoryObj<typeof TextList>;

export const Default: Story = {};
export const DensityDefault: Story = { args: { density: 'default' } };
export const DensityTight: Story = { args: { density: 'tight' } };

