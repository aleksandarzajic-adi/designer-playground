import type { Meta, StoryObj } from '@storybook/react';
import { TextPrice } from '@dp/ui';

const meta: Meta<typeof TextPrice> = {
  title: 'Components/TextPrice',
  component: TextPrice,
  args: { children: 'TextPrice' },
  argTypes: {
    size: { control: 'select', options: ['large', 'small'] }
  },
};

export default meta;
type Story = StoryObj<typeof TextPrice>;

export const Default: Story = {};
export const SizeLarge: Story = { args: { size: 'large' } };
export const SizeSmall: Story = { args: { size: 'small' } };

