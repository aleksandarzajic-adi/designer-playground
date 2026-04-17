import type { Meta, StoryObj } from '@storybook/react';
import { DateInputField } from '@dp/ui';

const meta: Meta<typeof DateInputField> = {
  title: 'Components/DateInputField',
  component: DateInputField,
  args: { label: 'Label', placeholder: 'Select…' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof DateInputField>;

export const Default: Story = {};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
