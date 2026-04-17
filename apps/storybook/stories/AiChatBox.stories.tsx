import type { Meta, StoryObj } from '@storybook/react';
import { AiChatBox } from '@dp/ui';

const meta: Meta<typeof AiChatBox> = {
  title: 'Components/AiChatBox',
  component: AiChatBox,
  args: { children: 'AiChatBox' },
};

export default meta;
type Story = StoryObj<typeof AiChatBox>;

export const Default: Story = {};


