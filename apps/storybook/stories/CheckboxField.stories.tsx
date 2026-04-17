import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxField } from '@dp/ui';

const meta: Meta<typeof CheckboxField> = {
  title: 'Components/CheckboxField',
  component: CheckboxField,
  args: { children: 'CheckboxField' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
