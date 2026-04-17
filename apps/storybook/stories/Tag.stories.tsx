import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@dp/ui';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Label' },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};


