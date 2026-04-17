import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '@dp/ui';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  args: { children: 'Tab' },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {};


