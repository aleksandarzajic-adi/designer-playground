import type { Meta, StoryObj } from '@storybook/react';
import { ButtonDanger } from '@dp/ui';

const meta: Meta<typeof ButtonDanger> = {
  title: 'Components/ButtonDanger',
  component: ButtonDanger,
  args: { children: 'Delete' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'subtle'] },
    size: { control: 'select', options: ['medium', 'small'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof ButtonDanger>;

export const Default: Story = {};
export const VariantPrimary: Story = { args: { variant: 'primary' } };
export const VariantSubtle: Story = { args: { variant: 'subtle' } };
export const SizeMedium: Story = { args: { size: 'medium' } };
export const SizeSmall: Story = { args: { size: 'small' } };
export const Disabled: Story = { args: { disabled: true } };
