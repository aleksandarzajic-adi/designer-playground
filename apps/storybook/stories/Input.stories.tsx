import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@dp/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'bad' } };
export const Disabled: Story = { args: { disabled: true } };
