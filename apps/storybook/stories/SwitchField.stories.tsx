import type { Meta, StoryObj } from '@storybook/react';
import { SwitchField } from '@dp/ui';

const meta: Meta<typeof SwitchField> = {
  title: 'Components/SwitchField',
  component: SwitchField,
  args: { children: 'SwitchField' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof SwitchField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
