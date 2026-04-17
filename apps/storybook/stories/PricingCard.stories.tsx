import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from '@dp/ui';

const meta: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  args: { children: 'PricingCard' },
  argTypes: {
    device: { control: 'select', options: ['desktop', 'mobile'] },
    variant: { control: 'select', options: ['stroke', 'brand'] }
  },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Default: Story = {};
export const DeviceDesktop: Story = { args: { device: 'desktop' } };
export const DeviceMobile: Story = { args: { device: 'mobile' } };
export const VariantStroke: Story = { args: { variant: 'stroke' } };
export const VariantBrand: Story = { args: { variant: 'brand' } };

