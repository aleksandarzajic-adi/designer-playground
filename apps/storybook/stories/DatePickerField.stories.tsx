import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerField } from '@dp/ui';

const meta: Meta<typeof DatePickerField> = {
  title: 'Components/DatePickerField',
  component: DatePickerField,
  args: { label: 'Label', placeholder: 'Select…' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof DatePickerField>;

export const Default: Story = {};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
