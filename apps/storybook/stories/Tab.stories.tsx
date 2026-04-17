import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '@dp/ui';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  args: { children: 'Tab' },
  argTypes: {
    active: { control: 'select', options: ['off', 'on'] }
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {};
export const ActiveOff: Story = { args: { active: 'off' } };
export const ActiveOn: Story = { args: { active: 'on' } };

