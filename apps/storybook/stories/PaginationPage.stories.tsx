import type { Meta, StoryObj } from '@storybook/react';
import { PaginationPage } from '@dp/ui';

const meta: Meta<typeof PaginationPage> = {
  title: 'Components/PaginationPage',
  component: PaginationPage,
  args: { children: 'PaginationPage' },
};

export default meta;
type Story = StoryObj<typeof PaginationPage>;

export const Default: Story = {};


