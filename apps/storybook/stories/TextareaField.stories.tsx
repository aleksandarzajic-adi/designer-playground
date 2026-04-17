import type { Meta, StoryObj } from '@storybook/react';
import { TextareaField } from '@dp/ui';

const meta: Meta<typeof TextareaField> = {
  title: 'Components/TextareaField',
  component: TextareaField,
  args: { children: 'TextareaField' },
  argTypes: {
    valueType: { control: 'select', options: ['default', 'placeholder'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof TextareaField>;

export const Default: Story = {};
export const ValueTypeDefault: Story = { args: { valueType: 'default' } };
export const ValueTypePlaceholder: Story = { args: { valueType: 'placeholder' } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
