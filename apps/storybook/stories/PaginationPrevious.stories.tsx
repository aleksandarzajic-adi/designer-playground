import type { Meta, StoryObj } from '@storybook/react';
import { PaginationPrevious } from '@dp/ui';

const meta: Meta<typeof PaginationPrevious> = {
  title: 'Components/PaginationPrevious',
  component: PaginationPrevious,
  args: { children: '1' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof PaginationPrevious>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
