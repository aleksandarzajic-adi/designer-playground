import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@dp/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'neutral', 'subtle'] },
    size: { control: 'select', options: ['medium', 'small'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const VariantPrimary: Story = { args: { variant: 'primary' } };
export const VariantNeutral: Story = { args: { variant: 'neutral' } };
export const VariantSubtle: Story = { args: { variant: 'subtle' } };
export const SizeMedium: Story = { args: { size: 'medium' } };
export const SizeSmall: Story = { args: { size: 'small' } };
export const Disabled: Story = { args: { disabled: true } };
