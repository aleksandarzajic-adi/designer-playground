import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from '@dp/ui';

const meta: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  args: { children: 'Card content' },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Default: Story = {};


