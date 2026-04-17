import type { Meta, StoryObj } from '@storybook/react';
import { Search } from '@dp/ui';

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  args: { children: 'Search' },
  argTypes: {
    valueType: { control: 'select', options: ['filled', 'placeholder'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};
export const ValueTypeFilled: Story = { args: { valueType: 'filled' } };
export const ValueTypePlaceholder: Story = { args: { valueType: 'placeholder' } };
export const Disabled: Story = { args: { disabled: true } };
