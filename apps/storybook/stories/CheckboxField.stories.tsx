import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxField } from '@dp/ui';

const meta: Meta<typeof CheckboxField> = {
  title: 'Components/CheckboxField',
  component: CheckboxField,
  args: { children: 'CheckboxField' },
  argTypes: {
    valueType: { control: 'select', options: ['unchecked', 'checked', 'indeterminate'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = {};
export const ValueTypeUnchecked: Story = { args: { valueType: 'unchecked' } };
export const ValueTypeChecked: Story = { args: { valueType: 'checked' } };
export const ValueTypeIndeterminate: Story = { args: { valueType: 'indeterminate' } };
export const Disabled: Story = { args: { disabled: true } };
