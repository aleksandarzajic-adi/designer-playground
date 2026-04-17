import type { Meta, StoryObj } from '@storybook/react';
import { Search } from '@dp/ui';

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  args: { label: 'Search', placeholder: 'Search…' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
