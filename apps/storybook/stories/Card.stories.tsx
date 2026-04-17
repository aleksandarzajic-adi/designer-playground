import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@dp/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: { children: 'Card' },
  argTypes: {
    assetType: { control: 'select', options: ['icon', 'image'] },
    variant: { control: 'select', options: ['stroke', 'default'] },
    direction: { control: 'select', options: ['horizontal', 'vertical'] }
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
export const AssetTypeIcon: Story = { args: { assetType: 'icon' } };
export const AssetTypeImage: Story = { args: { assetType: 'image' } };
export const VariantStroke: Story = { args: { variant: 'stroke' } };
export const VariantDefault: Story = { args: { variant: 'default' } };
export const DirectionHorizontal: Story = { args: { direction: 'horizontal' } };
export const DirectionVertical: Story = { args: { direction: 'vertical' } };

