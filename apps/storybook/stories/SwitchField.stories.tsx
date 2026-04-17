import type { Meta, StoryObj } from '@storybook/react';
import { SwitchField } from '@dp/ui';

const meta: Meta<typeof SwitchField> = {
  title: 'Components/SwitchField',
  component: SwitchField,
  args: { children: 'SwitchField' },
  argTypes: {
    valueType: { control: 'select', options: ['unchecked', 'checked'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof SwitchField>;

export const Default: Story = {};
export const ValueTypeUnchecked: Story = { args: { valueType: 'unchecked' } };
export const ValueTypeChecked: Story = { args: { valueType: 'checked' } };
export const Disabled: Story = { args: { disabled: true } };
