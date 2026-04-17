import type { Meta, StoryObj } from '@storybook/react';
import { PaginationNext } from '@dp/ui';

const meta: Meta<typeof PaginationNext> = {
  title: 'Components/PaginationNext',
  component: PaginationNext,
  args: { children: 'PaginationNext' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof PaginationNext>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
