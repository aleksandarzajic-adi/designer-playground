import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from '@dp/ui';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  args: { children: 'Label' },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {};


