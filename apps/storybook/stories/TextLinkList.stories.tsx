import type { Meta, StoryObj } from '@storybook/react';
import { TextLinkList } from '@dp/ui';

const meta: Meta<typeof TextLinkList> = {
  title: 'Components/TextLinkList',
  component: TextLinkList,
  args: { children: 'TextLinkList' },
  argTypes: {
    density: { control: 'select', options: ['default', 'tight'] }
  },
};

export default meta;
type Story = StoryObj<typeof TextLinkList>;

export const Default: Story = {};
export const DensityDefault: Story = { args: { density: 'default' } };
export const DensityTight: Story = { args: { density: 'tight' } };

