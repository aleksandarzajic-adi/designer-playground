import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@dp/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { children: 'Input' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};


