import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@dp/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: { children: 'Card content' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};


