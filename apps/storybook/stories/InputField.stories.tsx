import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from '@dp/ui';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: { children: 'InputField' },
  argTypes: {
    valueType: { control: 'select', options: ['default', 'placeholder'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {};
export const ValueTypeDefault: Story = { args: { valueType: 'default' } };
export const ValueTypePlaceholder: Story = { args: { valueType: 'placeholder' } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true } };
