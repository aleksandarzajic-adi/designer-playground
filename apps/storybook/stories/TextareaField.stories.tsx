import type { Meta, StoryObj } from '@storybook/react';
import { TextareaField } from '@dp/ui';

const meta: Meta<typeof TextareaField> = {
  title: 'Components/TextareaField',
  component: TextareaField,
  args: { label: 'Label', placeholder: 'Enter value' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof TextareaField>;

export const Default: Story = {};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
