import type { Meta, StoryObj } from '@storybook/react';
import { SelectField } from '@dp/ui';

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  args: { children: 'SelectField' },
  argTypes: {
    valueType: { control: 'select', options: ['default', 'placeholder'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {};
export const ValueTypeDefault: Story = { args: { valueType: 'default' } };
export const ValueTypePlaceholder: Story = { args: { valueType: 'placeholder' } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
