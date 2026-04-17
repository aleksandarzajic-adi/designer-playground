import type { Meta, StoryObj } from '@storybook/react';
import { DialogBody } from '@dp/ui';

const meta: Meta<typeof DialogBody> = {
  title: 'Components/DialogBody',
  component: DialogBody,
  args: { children: 'DialogBody' },
  argTypes: {
    type: { control: 'select', options: ['card', 'sheet'] }
  },
};

export default meta;
type Story = StoryObj<typeof DialogBody>;

export const Default: Story = {};
export const TypeCard: Story = { args: { type: 'card' } };
export const TypeSheet: Story = { args: { type: 'sheet' } };

