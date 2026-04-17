import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from '@dp/ui';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  args: { children: 'Notification' },
  argTypes: {
    variant: { control: 'select', options: ['message', 'alert'] }
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {};
export const VariantMessage: Story = { args: { variant: 'message' } };
export const VariantAlert: Story = { args: { variant: 'alert' } };

