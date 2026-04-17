import type { Meta, StoryObj } from '@storybook/react';
import { RadioField } from '@dp/ui';

const meta: Meta<typeof RadioField> = {
  title: 'Components/RadioField',
  component: RadioField,
  args: { children: 'RadioField' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof RadioField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
