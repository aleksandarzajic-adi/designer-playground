import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from '@dp/ui';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: { label: 'Label', placeholder: 'Enter value' },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true } };
