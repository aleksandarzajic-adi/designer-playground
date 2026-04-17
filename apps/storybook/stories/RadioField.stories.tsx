import type { Meta, StoryObj } from '@storybook/react';
import { RadioField } from '@dp/ui';

const meta: Meta<typeof RadioField> = {
  title: 'Components/RadioField',
  component: RadioField,
  args: { children: 'RadioField' },
  argTypes: {
    valueType: { control: 'select', options: ['unchecked', 'checked'] },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof RadioField>;

export const Default: Story = {};
export const ValueTypeUnchecked: Story = { args: { valueType: 'unchecked' } };
export const ValueTypeChecked: Story = { args: { valueType: 'checked' } };
export const Disabled: Story = { args: { disabled: true } };
