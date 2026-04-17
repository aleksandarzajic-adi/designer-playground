import type { Meta, StoryObj } from '@storybook/react';
import { SelectField } from '@dp/ui';

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  args: { label: 'Label', placeholder: 'Select…' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
