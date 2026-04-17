import type { Meta, StoryObj } from '@storybook/react';
import { MenuItem } from '@dp/ui';

const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
  args: { children: 'MenuItem' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
